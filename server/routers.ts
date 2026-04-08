import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getStudentByMatricNumber, createStudent, getStudentById, updateStudentProfile, getAllTimetables, getStudentTimetables, createTimetableFile, getAllTimetableFiles, deleteTimetableFile, createTimetable, getAllStudents, deleteTimetable } from "./db";
import { hashPassword, verifyPassword, isValidMatricNumber, isValidPassword } from "./auth";
import { ADMIN_CREDENTIALS } from "@shared/constants";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ Student Authentication ============
  student: router({
    register: publicProcedure
      .input(
        z.object({
          matricNumber: z.string().min(5, "Invalid matric number"),
          fullName: z.string().min(2, "Full name required"),
          department: z.string().min(2, "Department required"),
          password: z.string().min(6, "Password must be at least 6 characters"),
        })
      )
      .mutation(async ({ input }) => {
        // Check if student already exists
        const existingStudent = await getStudentByMatricNumber(input.matricNumber);
        if (existingStudent) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Matric number already registered",
          });
        }

        // Validate inputs
        if (!isValidMatricNumber(input.matricNumber)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid matric number format",
          });
        }

        if (!isValidPassword(input.password)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Password must be at least 6 characters",
          });
        }

        // Hash password and create student
        const passwordHash = hashPassword(input.password);
        const result = await createStudent({
          matricNumber: input.matricNumber,
          fullName: input.fullName,
          department: input.department,
          passwordHash,
        });

        return {
          success: true,
          message: "Student registered successfully",
        };
      }),

    login: publicProcedure
      .input(
        z.object({
          matricNumber: z.string(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const student = await getStudentByMatricNumber(input.matricNumber);
        if (!student || !verifyPassword(input.password, student.passwordHash)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid matric number or password",
          });
        }

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, JSON.stringify({ studentId: student.id, type: "student" }), {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return {
          success: true,
          student: {
            id: student.id,
            matricNumber: student.matricNumber,
            fullName: student.fullName,
            department: student.department,
            profilePhotoUrl: student.profilePhotoUrl,
          },
        };
      }),

    getProfile: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        const student = await getStudentById(input.studentId);
        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Student not found",
          });
        }

        return {
          id: student.id,
          matricNumber: student.matricNumber,
          fullName: student.fullName,
          department: student.department,
          profilePhotoUrl: student.profilePhotoUrl,
          createdAt: student.createdAt,
        };
      }),

    updateProfile: publicProcedure
      .input(
        z.object({
          studentId: z.number(),
          fullName: z.string().optional(),
          profilePhotoUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const student = await getStudentById(input.studentId);
        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Student not found",
          });
        }

        const updateData: any = {};
        if (input.fullName) updateData.fullName = input.fullName;
        if (input.profilePhotoUrl) updateData.profilePhotoUrl = input.profilePhotoUrl;

        await updateStudentProfile(input.studentId, updateData);

        return {
          success: true,
          message: "Profile updated successfully",
        };
      }),

    getTimetable: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        const timetables = await getStudentTimetables(input.studentId);
        return timetables.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
      }),
  }),

  // ============ Admin Authentication & Management ============
  admin: router({
    login: publicProcedure
      .input(
        z.object({
          login: z.string(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Hardcoded admin credentials
        if (input.login !== ADMIN_CREDENTIALS.login || input.password !== ADMIN_CREDENTIALS.password) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin credentials",
          });
        }

        // Set admin session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, JSON.stringify({ adminId: "admin", type: "admin" }), {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return {
          success: true,
          message: "Admin logged in successfully",
        };
      }),

    uploadTimetableFile: publicProcedure
      .input(
        z.object({
          fileUrl: z.string(),
          fileName: z.string(),
          fileType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createTimetableFile({
          fileUrl: input.fileUrl,
          fileName: input.fileName,
          fileType: input.fileType,
          uploadedByAdmin: ADMIN_CREDENTIALS.login,
        });

        return {
          success: true,
          message: "Timetable file uploaded successfully",
        };
      }),

    getTimetableFiles: publicProcedure.query(async () => {
      return await getAllTimetableFiles();
    }),

    deleteTimetableFile: publicProcedure
      .input(z.object({ fileId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTimetableFile(input.fileId);
        return {
          success: true,
          message: "Timetable file deleted successfully",
        };
      }),

    uploadTimetableData: publicProcedure
      .input(
        z.object({
          examId: z.string(),
          courseCode: z.string(),
          courseName: z.string(),
          department: z.string(),
          examDate: z.string(),
          startTime: z.string(),
          endTime: z.string(),
          venue: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await createTimetable(input);
        return {
          success: true,
          message: "Timetable data uploaded successfully",
        };
      }),

    getAllStudents: publicProcedure.query(async () => {
      return await getAllStudents();
    }),

    getAllTimetables: publicProcedure.query(async () => {
      return await getAllTimetables();
    }),

    getTimetablesByDepartment: publicProcedure
      .input(z.object({ department: z.string() }))
      .query(async ({ input }) => {
        const timetables = await getAllTimetables();
        return timetables.filter(t => t.department === input.department);
      }),

    deleteTimetable: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTimetable(input.id);
        return {
          success: true,
          message: "Timetable deleted successfully",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
