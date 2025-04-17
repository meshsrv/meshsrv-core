import { getCurrentServer } from '@/api';
import { db } from '@/db';
import { notificationTable, type NewNotification } from '@/db/schema';

export async function notify(v: NewNotification) {
  const msg = JSON.stringify({ level: v.level, data: v.data });
  console.log(`Push notification: ${msg}`);
  getCurrentServer()?.publish('notification', msg);
  await db.insert(notificationTable).values(v);
}
