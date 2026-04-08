import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, datetime } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Students table for TSU exam portal
 * Stores student-specific information including matric number, department, and profile photo
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  matricNumber: varchar("matricNumber", { length: 50 }).notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  profilePhotoUrl: text("profilePhotoUrl"), // CDN URL to S3
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Timetables table for storing exam schedule information
 * Each row represents an exam entry in the timetable
 * Department field allows for department-specific exam schedules
 */
export const timetables = mysqlTable("timetables", {
  id: int("id").autoincrement().primaryKey(),
  examId: varchar("examId", { length: 100 }).notNull().unique(),
  courseCode: varchar("courseCode", { length: 50 }).notNull(),
  courseName: varchar("courseName", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  examDate: varchar("examDate", { length: 50 }).notNull(), // Format: YYYY-MM-DD
  startTime: varchar("startTime", { length: 50 }).notNull(), // Format: HH:MM
  endTime: varchar("endTime", { length: 50 }).notNull(), // Format: HH:MM
  venue: varchar("venue", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Timetable = typeof timetables.$inferSelect;
export type InsertTimetable = typeof timetables.$inferInsert;

/**
 * Department list for TSU
 */
export const DEPARTMENTS = [
  "Computer Science",
  "Computer Science Education",
  "Information Technology",
  "Software Engineering",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

/**
 * Student-Timetable junction table for many-to-many relationship
 * Links students to their exam timetables
 */
export const studentTimetables = mysqlTable("studentTimetables", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  timetableId: int("timetableId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StudentTimetable = typeof studentTimetables.$inferSelect;
export type InsertStudentTimetable = typeof studentTimetables.$inferInsert;

/**
 * Timetable files table for storing uploaded timetable files
 * Admin uploads timetable files (PDF/Excel/Image) which are stored in S3
 */
export const timetableFiles = mysqlTable("timetableFiles", {
  id: int("id").autoincrement().primaryKey(),
  fileUrl: text("fileUrl").notNull(), // CDN URL to S3
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 50 }).notNull(), // pdf, excel, image, etc.
  uploadedByAdmin: varchar("uploadedByAdmin", { length: 255 }).notNull(), // Admin identifier
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type TimetableFile = typeof timetableFiles.$inferSelect;
export type InsertTimetableFile = typeof timetableFiles.$inferInsert;

/**
 * Helper to get all departments
 */
export function getAllDepartments() {
  return DEPARTMENTS;
}
