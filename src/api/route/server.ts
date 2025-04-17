import { db } from '@/db';
import { serverTable } from '@/db/schema';
import { respt } from '@/util/type';
import { createSelectSchema } from 'drizzle-typebox';
import { Elysia, t } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

const serverSelectSchema = createSelectSchema(serverTable);

export const serverRoute = new Elysia()
  .use(auth)
  .use(response)
  .get(
    '/server/list',
    async ({ suc }) => {
      return suc(await db.query.serverTable.findMany());
    },
    {
      isAuth: true,
      response: respt(t.Array(serverSelectSchema)),
      detail: {
        tags: ['server'],
      },
    }
  );
