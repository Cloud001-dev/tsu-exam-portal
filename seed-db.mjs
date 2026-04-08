import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('🌱 Seeding database with sample data...\n');

  // Sample timetable data
  const timetables = [
    {
      examId: 'CS101-2026-05',
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      examDate: '2026-05-15',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Hall A',
    },
    {
      examId: 'CS102-2026-05',
      courseCode: 'CS102',
      courseName: 'Data Structures',
      examDate: '2026-05-16',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Hall B',
    },
    {
      examId: 'CS201-2026-05',
      courseCode: 'CS201',
      courseName: 'Database Systems',
      examDate: '2026-05-17',
      startTime: '14:00',
      endTime: '17:00',
      venue: 'Hall C',
    },
    {
      examId: 'CS202-2026-05',
      courseCode: 'CS202',
      courseName: 'Web Development',
      examDate: '2026-05-18',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Hall A',
    },
    {
      examId: 'CS301-2026-05',
      courseCode: 'CS301',
      courseName: 'Artificial Intelligence',
      examDate: '2026-05-19',
      startTime: '14:00',
      endTime: '17:00',
      venue: 'Hall D',
    },
    {
      examId: 'CS302-2026-05',
      courseCode: 'CS302',
      courseName: 'Machine Learning',
      examDate: '2026-05-20',
      startTime: '09:00',
      endTime: '12:00',
      venue: 'Hall E',
    },
  ];

  // Insert timetables
  for (const timetable of timetables) {
    const query = `
      INSERT INTO timetables (examId, courseCode, courseName, examDate, startTime, endTime, venue)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      courseCode = VALUES(courseCode),
      courseName = VALUES(courseName),
      examDate = VALUES(examDate),
      startTime = VALUES(startTime),
      endTime = VALUES(endTime),
      venue = VALUES(venue)
    `;

    await connection.execute(query, [
      timetable.examId,
      timetable.courseCode,
      timetable.courseName,
      timetable.examDate,
      timetable.startTime,
      timetable.endTime,
      timetable.venue,
    ]);

    console.log(`✅ Added exam: ${timetable.courseCode} - ${timetable.courseName}`);
  }

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📋 Sample Timetable Data Added:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  timetables.forEach((t) => {
    console.log(`${t.courseCode}: ${t.examDate} (${t.startTime}-${t.endTime}) - ${t.venue}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
} finally {
  await connection.end();
}
