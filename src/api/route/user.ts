import { respt } from '@/util/type';
import { Elysia, t } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

export const userRoute = new Elysia()
  .use(auth)
  .use(response)
  .get('/user-info', ({ user, suc }) => suc(user), {
    isAuth: true,
    response: respt(
      t.Object({
        id: t.Number(),
        username: t.String(),
        nickname: t.Nullable(t.String()),
      })
    ),
    detail: {
      tags: ['user'],
    },
  });
