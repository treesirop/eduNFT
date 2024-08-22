import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { admins, nftCollections, nfts, teachers, users } from "./schema"; // 确保路径正确

type DBSchema = {
  users: typeof users;
  teachers: typeof teachers;
  nfts: typeof nfts
  nftCollections: typeof nftCollections,
  admins: typeof admins
};

export async function connectToDatabase(): Promise<{ db: MySql2Database<DBSchema>; connection: mysql.Connection }> {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "api",
    password: "123456",
  });
  const db = drizzle<DBSchema>(connection);
  return { db, connection };
}