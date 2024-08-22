import { nfts, users } from '../schema';
import { connectToDatabase } from ".."; // 确保路径正确
import { eq } from 'drizzle-orm';

// 封装数据库连接逻辑
async function getDbConnection() {
  const { db, connection } = await connectToDatabase();
  return db;
}

// 创建用户
async function createUser(username: string, email: string, password: string) {
  const db = await getDbConnection();
  const result = await db.insert(users).values({
    username,
    email,
    password,
    createdAt: new Date(), // 或者使用你的默认值函数
  }).execute();
  return result;
}

async function getAllUsers() {
  const db = await getDbConnection();
  try {
    // 使用Drizzle ORM的API
    const result = await db.select().from(users).execute();
    return result;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Unable to fetch users');
  }
}

// 根据ID获取用户
async function getUserById(id: number) {
  const db = await getDbConnection();
  try {
    // 使用 Drizzle ORM 的查询构造方法
    const result = await db.query.users.findMany({
      where: eq(users.id, id), // 使用 eq 操作符来过滤
    });
    return result[0] || null; // 返回第一个匹配的结果或 null
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Unable to fetch user');
  }
}

// 更新用户信息
async function updateUser(id: number, updates: Partial<typeof users.$inferInsert>) {
  const db = await getDbConnection();
  try {
    // 使用 Drizzle ORM 的更新方法
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id)) // 使用 eq 操作符来过滤
      .execute();
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Unable to update user');
  }
}

// 删除用户
async function deleteUser(id: number) {
  const db = await getDbConnection();
  try {
    // 使用 Drizzle ORM 的删除方法
    const result = await db
      .delete(users)
      .where(eq(users.id, id)) // 使用 eq 操作符来过滤
      .execute();
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Unable to delete user');
  }
}

async function getUserNfts(userId: number) {
  const db = await getDbConnection();
  try {
    // 查询用户的 NFT 信息，同时加载关联的 Teacher 和 NFTCollection 信息
    const userNfts = await db.query.nfts.findMany({
      where: (nfts, { eq }) =>  eq(nfts.userId, BigInt(userId)), // 使用 eq 操作符来过滤
      with: {
        teacher: true,  // 加载关联的教师信息
        collection: true,  // 加载关联的 NFT 合集信息
      },
    });

    return userNfts;
  } catch (error) {
    console.error('Error fetching NFTs for user:', error);
    throw new Error('Unable to fetch NFTs');
  }
}

// 导出控制器函数
export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserNfts
};