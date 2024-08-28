import { admins } from '../schema';
import { db } from ".."; // 确保路径正确
import { eq } from 'drizzle-orm';

// Function to initialize the database

export async function initDatabase() {
  try {
    // Check if the admins user already exists

    const adminsExists = await db.select().from(admins).where(eq(admins.username, 'admins')).limit(1);

    if (!adminsExists.length) {
      // Insert the admins user if not exists
      await db.insert(admins).values({
        username: 'admins',
        password: '123456', // Ideally, hash the password before storing it
      });

      console.log('admins user created successfully.');
    } else {
      console.log('admins user already exists.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}