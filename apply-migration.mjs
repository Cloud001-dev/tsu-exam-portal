import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('📦 Applying migration: Add department field to timetables...\n');

  // Read and execute the migration SQL
  const migrationSQL = fs.readFileSync('drizzle/0002_peaceful_shinobi_shaw.sql', 'utf8');
  
  await connection.execute(migrationSQL);

  console.log('✅ Migration applied successfully!\n');
  console.log('📋 Changes:');
  console.log('   - Added "department" field to timetables table');
  console.log('   - Field type: varchar(255) NOT NULL');

} catch (error) {
  console.error('❌ Error applying migration:', error.message);
  process.exit(1);
} finally {
  await connection.end();
}
