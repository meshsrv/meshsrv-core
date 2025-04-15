import { getCurrentServer } from '@/api';
import { db } from '@/db';
import { notificationTable, type NewNotification } from '@/db/schema';

export async function notify(v: NewNotification) {
  getCurrentServer()?.publish(
    'notification',
    JSON.stringify({
      level: v.level,
      data: v.data,
    })
  );
  await db.insert(notificationTable).values(v);
}
