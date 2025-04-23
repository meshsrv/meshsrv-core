import { db } from '@/db';
import { notificationTable, type NewNotification } from '@/db/schema';
import { publishToDashboard } from './ws';

export async function notify(v: NewNotification) {
  const msg = { level: v.level, data: v.data };
  console.log(`[Push Notification] ${JSON.stringify(msg)}`);
  publishToDashboard('notification', msg);
  await db.insert(notificationTable).values(v);
}
