import { admins } from '../schema';
import { db } from ".."; // 确保路径正确
import { eq, SQL, SQLWrapper } from 'drizzle-orm';

// 创建管理员
async function createAdmin(username: any, password: any, email: any) {

  const result = await db.insert(admins).values({
    username,
    password,
    createdAt: new Date(), // 或者使用你的默认值函数
  }).execute();
  return result;
}

// 获取所有管理员
async function getAllAdmins() {
  try {
    const result = await db.select().from(admins).execute();
    return result;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw new Error('Unable to fetch admins');
  }
}

// 根据ID获取管理员
async function getAdminById(id: number | SQLWrapper) {
  try {
    const result = await db.query.admins.findMany({
      where: eq(admins.id, id),
    });
    return result[0] || null; // 返回第一个匹配的结果或 null
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    throw new Error('Unable to fetch admin');
  }
}

// 更新管理员信息
async function updateAdmin(id: number | SQLWrapper, updates: { username?: string | SQL<unknown> | undefined; password?: string | SQL<unknown> | undefined; email?: string | SQL<unknown> | undefined; id?: number | SQL<unknown> | undefined; createdAt?: SQL<unknown> | Date | undefined; }) {

  try {
    const result = await db
      .update(admins)
      .set(updates)
      .where(eq(admins.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error updating admin:', error);
    throw new Error('Unable to update admin');
  }
}

// 删除管理员
async function deleteAdmin(id: number | SQLWrapper) {
  try {
    const result = await db
      .delete(admins)
      .where(eq(admins.id, id))
      .execute();
    return result;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw new Error('Unable to delete admin');
  }
}

// 导出控制器函数
export const adminController = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
