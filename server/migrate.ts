import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db,connection } from '.'; // 确保路径正确

async function runMigrations() {

  try {
    // 运行迁移
    await migrate(db, { migrationsFolder: './server/migrations' });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Failed to run migrations:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

runMigrations();