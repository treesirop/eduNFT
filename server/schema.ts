import { mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const posts = mysqlTable("posts", {
    id: serial("id").primaryKey().notNull(),
    title: text("title").notNull(),
});