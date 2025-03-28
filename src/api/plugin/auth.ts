import { validateSessionToken } from '@/service/session';
import { Elysia } from 'elysia';

export const auth = new Elysia({ name: 'Plugin.Auth' }).macro({
  isAuth: {
    async resolve({ headers, error }) {
      const { session, user } = await validateSessionToken(headers['authorization']);
      if (!session || !user) return error(401);
      return { session, user };
    },
  },
});
