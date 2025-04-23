import { db } from '@/db';
import { notificationTable } from '@/db/schema';
import { respt } from '@/util/type';
import { inArray } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-typebox';
import { Elysia, t } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

const notificationSelectSchema = createSelectSchema(notificationTable);

export const notificationRoute = new Elysia()
  .use(auth)
  .use(response)
  .ws('/ws/notification', {
    isAuth: true,
    open(ws) {
      if (!ws.isSubscribed('notification')) {
        ws.subscribe('notification');
      }
    },
    close(ws) {
      if (ws.isSubscribed('notification')) {
        ws.unsubscribe('notification');
      }
    },
  })
  .get(
    '/notification/list',
    async ({ suc }) => {
      return suc(
        await db.query.notificationTable.findMany({ orderBy: (v, { desc }) => [desc(v.createdAt)] })
      );
    },
    {
      isAuth: true,
      response: respt(t.Array(notificationSelectSchema)),
      detail: {
        tags: ['notification'],
      },
    }
  )
  .put(
    '/notification/read',
    async ({ body, suc }) => {
      const result = await db
        .update(notificationTable)
        .set({ read: true })
        .where(inArray(notificationTable.id, body))
        .then(() => true)
        .catch(() => false); // TODO: log error
      return suc(result);
    },
    {
      isAuth: true,
      body: t.Array(t.Number()),
      response: respt(t.Boolean()),
      detail: {
        tags: ['notification'],
      },
    }
  );
