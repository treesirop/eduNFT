import { admins, teachers } from '../schema';
import { db } from ".."; // 确保路径正确
import { eq } from 'drizzle-orm';


// 创建教师
async function createTeacher(email: string, password: string) {
  const result = await db.insert(teachers).values({
    email,
    password,
    createdAt: new Date(), // 或者使用你的默认值函数
  }).execute();
  return result;
}

// 获取所有教师
async function getAllTeachers() {
  try {
    const result = await db.select().from(teachers).execute();
    return result;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw new Error('Unable to fetch teachers');
  }
}

// 根据ID获取教师
async function getId(email: string) {
  try {
    const result = await db.select().from(teachers).where(eq(teachers.email, email)).limit(1);
    return result || null; // 返回第一个匹配的结果或 null
  } catch (error) {
    console.error('Error fetching teacher by email:', error);
    throw new Error('Unable to fetch teacher');
  }
}
// 根据ID获取教师
async function getTeacherById(id: number) {
  try {
    const result = await db.query.teachers.findMany({
      where: eq(teachers.id, id),
    });
    return result[0] || null; // 返回第一个匹配的结果或 null
  } catch (error) {
    console.error('Error fetching teacher by ID:', error);
    throw new Error('Unable to fetch teacher');
  }
}

// 更新教师信息
async function updateTeacher(id: number, updates: Partial<typeof teachers.$inferInsert>) {
  try {
    const result = await db
      .update(teachers)
      .set(updates)
      .where(eq(teachers.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw new Error('Unable to update teacher');
  }
}

// 删除教师
async function deleteTeacher(id: number) {
  try {
    const result = await db
      .delete(teachers)
      .where(eq(teachers.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw new Error('Unable to delete teacher');
  }
}

// 导出控制器函数
export const teacherController = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getId
};