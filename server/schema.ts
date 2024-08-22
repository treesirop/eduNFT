import { mysqlTable, serial, varchar, timestamp, int, text, bigint } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// 管理员信息表
export const admins = mysqlTable('Admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 用户信息表
export const users = mysqlTable('Users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 教师信息表
export const teachers = mysqlTable('Teachers', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

// NFT信息表
export const nfts = mysqlTable('NFTs', {
  id: serial('id').primaryKey(),
  tokenId: int('token_id').notNull(),
  ocid: varchar('ocid', { length: 255 }).notNull(),
  userId: bigint('user_id}',{mode: "bigint"}).references(() => users.id).notNull(),
  teacherId: bigint('teacher_id',{mode: "bigint"}).references(() => teachers.id).notNull(),
  collectionId: bigint('collection_id',{mode: 'bigint'}).references(() => nftCollections.id).notNull(),
  mintedAt: timestamp('minted_at').defaultNow().notNull(),
});

// NFT合集表
export const nftCollections = mysqlTable('NFTCollections', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
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
  teacher: one(teachers, {
    fields: [nfts.teacherId],
    references: [teachers.id],
  }),
  collection: one(nftCollections, {
    fields: [nfts.collectionId],
    references: [nftCollections.id],
  }),
}));

export const nftCollectionsRelations = relations(nftCollections, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [nftCollections.teacherId],
    references: [teachers.id],
  }),
  nfts: many(nfts),
}));