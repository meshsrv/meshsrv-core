import { db } from '@/db';
import { verifyPasswordHash } from '@/service/password';
import { createSession, generateSessionToken } from '@/service/session';
import { createUser, getUserFromUsername, getUserPasswordHash } from '@/service/user';
import { Elysia, t } from 'elysia';
import { auth } from './plugin/auth';
import { response } from './plugin/response';

export const apiServer = new Elysia()
  .use(auth)
  .use(response)
  .get('/', ({ user }) => user, { isAuth: true })
  .post(
    '/sign-in',
    async ({ body: { username, password }, suc, err }) => {
      const user = await getUserFromUsername(username);
      if (!user) return err(400, 'Invalid username or password');

      const hash = await getUserPasswordHash(user.id);
      const isValid = await verifyPasswordHash(password, hash);
      if (!isValid) return err(400, 'Invalid username or password');

      const token = generateSessionToken();
      createSession(token, user.id);
      return suc({ token });
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    '/sign-up',
    async ({ body: { username, password }, suc, err }) => {
      // TODO: currently only allow one user
      const row = await db.query.userTable.findFirst();
      if (row) return err(400, 'Sign up is not allowed');

      const user = await createUser(username, password);
      const token = generateSessionToken();
      createSession(token, user.id);
      return suc({ token });
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  );
