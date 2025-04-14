import type { BasicData } from '@/models/agent';
import { sql, type InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
  nickname: text(),
});
export type User = InferSelectModel<typeof userTable>;
export type SafeUser = Omit<User, 'passwordHash'> & { passwordHash?: never };

export const sessionTable = sqliteTable('session', {
  id: text().primaryKey(),
  userId: int()
    .notNull()
    .references(() => userTable.id),
  expiresAt: int({ mode: 'timestamp' }).notNull(),
});
export type Session = InferSelectModel<typeof sessionTable>;

export const serverTable = sqliteTable('server', {
  id: text().primaryKey(), // uuid
  spec: text({ mode: 'json' }).$type<BasicData>().notNull(),
  latestPing: int({ mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
export type Server = InferSelectModel<typeof serverTable>;
export type NewServer = typeof serverTable.$inferInsert;

export interface NotificationData {
  type: 'message';
  title: string;
  description?: string;
}
export const notificationTable = sqliteTable('notification', {
  id: int().primaryKey({ autoIncrement: true }),
  level: text({ enum: ['success', 'info', 'warning', 'error'] }).notNull(),
  data: text({ mode: 'json' }).$type<NotificationData>().notNull(),
  read: int({ mode: 'boolean' }).notNull().default(false),
  createdAt: int({ mode: 'timestamp' })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
export type Notification = InferSelectModel<typeof notificationTable>;
export type NewNotification = typeof notificationTable.$inferInsert;
