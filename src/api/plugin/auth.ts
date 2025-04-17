import { validateSessionToken } from '@/service/session';
import { getAgentSecret } from '@/util/agent';
import { Elysia } from 'elysia';

export const auth = new Elysia({ name: 'Plugin.Auth' }).macro({
  isAuth: {
    async resolve({ headers, error }) {
      let token = headers['authorization'];
      if (!token) {
        // since the browser websocket api does not allow custom headers
        token = headers['sec-websocket-protocol'];
      }
      const { session, user } = await validateSessionToken(token);
      if (!session || !user) return error(401);
      return { session, user };
    },
  },
  isAgent: {
    async beforeHandle({ headers, error }) {
      const token = headers['authorization'] || headers['sec-websocket-protocol'];
      if (token !== (await getAgentSecret())) return error(401);
    },
  },
});
