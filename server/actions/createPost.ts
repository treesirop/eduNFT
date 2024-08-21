"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from ".."; // 确保路径正确
import { posts } from "../schema";

export default async function createPost(formData: FormData) {
    const title = formData.get("title")?.toString();
    if (!title) {
        return { error: "Title is required" };
    }

    try {
        const {db, connection} = await connectToDatabase(); // 获取数据库连接
        await db.insert(posts).values({ title });
        revalidatePath("/");
        return { success: "Post Created" };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { error: "Failed to create post" };
    }
}