import { userTable } from '@/db/schema';
import { respt } from '@/util/type';
import { createSelectSchema } from 'drizzle-typebox';
import { Elysia, t } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

const userSelectSchema = createSelectSchema(userTable, {
  passwordHash: t.Optional(t.Null()),
});

export const userRoute = new Elysia()
  .use(auth)
  .use(response)
  .get('/user/info', ({ user, suc }) => suc(user), {
    isAuth: true,
    response: respt(userSelectSchema),
    detail: {
      tags: ['user'],
    },
  });
