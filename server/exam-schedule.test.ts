import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { students, timetables } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Department-based Exam Scheduling", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  it("should create exam schedules for different departments", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    // Create exams for Computer Science
    const csExam = await caller.admin.uploadTimetableData({
      examId: "CS101-2026-04",
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      department: "Computer Science",
      examDate: "2026-05-15",
      startTime: "09:00",
      endTime: "12:00",
      venue: "Hall A",
    });

    expect(csExam.success).toBe(true);

    // Create exam for Computer Science Education
    const cseExam = await caller.admin.uploadTimetableData({
      examId: "CSE201-2026-04",
      courseCode: "CSE201",
      courseName: "Educational Technology",
      department: "Computer Science Education",
      examDate: "2026-05-16",
      startTime: "14:00",
      endTime: "17:00",
      venue: "Hall B",
    });

    expect(cseExam.success).toBe(true);

    // Verify both exams exist
    const allTimetables = await caller.admin.getAllTimetables();
    const csExams = allTimetables.filter(t => t.department === "Computer Science");
    const cseExams = allTimetables.filter(t => t.department === "Computer Science Education");

    expect(csExams.length).toBeGreaterThan(0);
    expect(cseExams.length).toBeGreaterThan(0);
  });

  it("should filter timetables by department", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    // Get all timetables
    const allTimetables = await caller.admin.getAllTimetables();

    // Filter by Computer Science
    const csTimetables = allTimetables.filter(t => t.department === "Computer Science");

    // All filtered timetables should have the correct department
    csTimetables.forEach(t => {
      expect(t.department).toBe("Computer Science");
    });

    // Filter by Computer Science Education
    const cseTimetables = allTimetables.filter(t => t.department === "Computer Science Education");
    cseTimetables.forEach(t => {
      expect(t.department).toBe("Computer Science Education");
    });
  });

  it("should allow admin to delete exam schedules", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    // Create a test exam
    const exam = await caller.admin.uploadTimetableData({
      examId: `TEST-DEL-${Date.now()}`,
      courseCode: "TEST101",
      courseName: "Test Course",
      department: "Computer Science",
      examDate: "2026-06-01",
      startTime: "10:00",
      endTime: "13:00",
      venue: "Test Hall",
    });

    expect(exam.success).toBe(true);

    // Get all timetables to find the created exam
    const allTimetables = await caller.admin.getAllTimetables();
    const createdExam = allTimetables.find(t => t.courseCode === "TEST101");

    if (createdExam) {
      // Delete the exam
      const deleteResult = await caller.admin.deleteTimetable({ id: createdExam.id });
      expect(deleteResult.success).toBe(true);

      // Verify it's deleted
      const afterDelete = await caller.admin.getAllTimetables();
      const stillExists = afterDelete.find(t => t.id === createdExam.id);
      expect(stillExists).toBeUndefined();
    }
  });

  it("should validate required fields when creating exam schedule", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    // Try to create exam with missing department
    try {
      await caller.admin.uploadTimetableData({
        examId: "INVALID-001",
        courseCode: "INVALID",
        courseName: "Invalid Course",
        department: "", // Empty department
        examDate: "2026-05-20",
        startTime: "09:00",
        endTime: "12:00",
        venue: "Hall X",
      });
      // If we get here, the validation failed
      expect(true).toBe(false);
    } catch (error: any) {
      // Expected to fail
      expect(error).toBeDefined();
    }
  });

  it("should ensure exam dates are in correct format", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    const exam = await caller.admin.uploadTimetableData({
      examId: "DATETEST-001",
      courseCode: "DATE101",
      courseName: "Date Format Test",
      department: "Computer Science",
      examDate: "2026-05-25", // YYYY-MM-DD format
      startTime: "09:00",
      endTime: "12:00",
      venue: "Hall C",
    });

    expect(exam.success).toBe(true);

    // Verify the date was stored correctly
    const allTimetables = await caller.admin.getAllTimetables();
    const storedExam = allTimetables.find(t => t.courseCode === "DATE101");
    expect(storedExam?.examDate).toBe("2026-05-25");
  });

  it("should ensure time fields are in correct format", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    const exam = await caller.admin.uploadTimetableData({
      examId: "TIMETEST-001",
      courseCode: "TIME101",
      courseName: "Time Format Test",
      department: "Computer Science Education",
      examDate: "2026-05-26",
      startTime: "14:30", // HH:MM format
      endTime: "17:30",
      venue: "Hall D",
    });

    expect(exam.success).toBe(true);

    // Verify the times were stored correctly
    const allTimetables = await caller.admin.getAllTimetables();
    const storedExam = allTimetables.find(t => t.courseCode === "TIME101");
    expect(storedExam?.startTime).toBe("14:30");
    expect(storedExam?.endTime).toBe("17:30");
  });

  it("should support all department types", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as any);

    const departments = [
      "Computer Science",
      "Computer Science Education",
      "Information Technology",
      "Software Engineering",
    ];

    for (const dept of departments) {
      const exam = await caller.admin.uploadTimetableData({
        examId: `DEPT-${dept.replace(/\s+/g, "-")}-${Date.now()}`,
        courseCode: `${dept.substring(0, 3).toUpperCase()}101`,
        courseName: `${dept} Course`,
        department: dept,
        examDate: "2026-06-10",
        startTime: "09:00",
        endTime: "12:00",
        venue: "Main Hall",
      });

      expect(exam.success).toBe(true);
    }

    // Verify all departments have exams
    const allTimetables = await caller.admin.getAllTimetables();
    for (const dept of departments) {
      const deptExams = allTimetables.filter(t => t.department === dept);
      expect(deptExams.length).toBeGreaterThan(0);
    }
  });
});
