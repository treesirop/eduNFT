import { mysqlTable, serial, varchar, timestamp, int, text, bigint, boolean } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// 管理员信息表
export const admins = mysqlTable('Admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 用户信息表
export const users = mysqlTable('Users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userhash: varchar('userhash', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 教师信息表
export const teachers = mysqlTable('Teachers', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

// NFT信息表
export const nfts = mysqlTable('NFTs', {
  id: serial('id').primaryKey(),
  tokenId: bigint('token_id',{mode: "bigint"}).notNull(),
  tokenURI: varchar('hash',{length: 512}).notNull(),
  userId: bigint('user_id',{mode: "bigint"}).references(() => users.id).notNull(),
  mintedAt: timestamp('minted_at').defaultNow().notNull(),
});

// NFT合集表
export const nftCollections = mysqlTable('NFTCollections', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    is_approved: boolean('is_approved').notNull(),
    contractAddress: varchar('contractAddress',{length:255}).notNull(),
    user_id: bigint('user_id',{mode: 'bigint'}).references(()=>users.id),
    teacherId: bigint('teacher_id',{mode:'bigint'}).notNull().references(() => teachers.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

// 定义表之间的关系
export const usersRelations = relations(users, ({ many }) => ({
  nfts: many(nfts),
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  nfts: many(nfts),
  nftCollections: many(nftCollections),
}));

export const nftsRelations = relations(nfts, ({ one }) => ({
  user: one(users, {
    fields: [nfts.userId],
    references: [users.id],
  }),
}));

export const nftCollectionsRelations = relations(nftCollections, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [nftCollections.teacherId],
    references: [teachers.id],
  }),
  nfts: many(nfts),
}));