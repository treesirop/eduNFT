"use server";

import { connectToDatabase } from ".."; // 确保路径正确


export default async function getPosts() {
    try {
        const {db,connection} = await connectToDatabase(); // 获取数据库连接
        const posts = await db.query.posts.findMany();
        if (!posts || posts.length === 0) {
            return { error: "Posts not found" };
        }
        return { success: posts };
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return { error: "Failed to fetch posts" };
    }
}