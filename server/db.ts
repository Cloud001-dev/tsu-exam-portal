import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { InsertUser, users, InsertStudent, students, InsertTimetable, timetables, studentTimetables, timetableFiles, InsertTimetableFile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Student Database Helpers ============

export async function createStudent(data: InsertStudent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(students).values(data);
  return result;
}

export async function getStudentByMatricNumber(matricNumber: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(students).where(eq(students.matricNumber, matricNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStudentProfile(studentId: number, data: Partial<InsertStudent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.update(students).set(data).where(eq(students.id, studentId));
  return result;
}

export async function getAllStudents() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(students);
}

// ============ Timetable Database Helpers ============

export async function createTimetable(data: InsertTimetable) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(timetables).values(data);
  return result;
}

export async function getTimetableById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(timetables).where(eq(timetables.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllTimetables() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(timetables);
}

export async function getStudentTimetables(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get student's department
  const student = await getStudentById(studentId);
  if (!student) return [];

  // Get all timetables for the student's department
  const result = await db
    .select()
    .from(timetables)
    .where(eq(timetables.department, student.department));

  return result;
}

export async function getTimetablesByDepartment(department: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(timetables)
    .where(eq(timetables.department, department));

  return result;
}

export async function assignTimetableToStudent(studentId: number, timetableId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(studentTimetables).values({ studentId, timetableId });
  return result;
}

export async function deleteTimetable(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete student-timetable associations first
  await db.delete(studentTimetables).where(eq(studentTimetables.timetableId, id));
  
  // Then delete the timetable
  const result = await db.delete(timetables).where(eq(timetables.id, id));
  return result;
}

// ============ Timetable File Database Helpers ============

export async function createTimetableFile(data: InsertTimetableFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(timetableFiles).values(data);
  return result;
}

export async function getTimetableFileById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(timetableFiles).where(eq(timetableFiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllTimetableFiles() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(timetableFiles);
}

export async function deleteTimetableFile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(timetableFiles).where(eq(timetableFiles.id, id));
  return result;
}
