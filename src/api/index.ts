import type { Nullable } from '@/util/type';
import swagger from '@elysiajs/swagger';
import { file } from 'bun';
import { Elysia } from 'elysia';
import type { Server } from 'elysia/universal';
import { authRoute } from './route/auth';
import { userRoute } from './route/user';

export let CURRENT_SERVER: Nullable<Server> = null;

export function runApiServer(cert: string, key: string) {
  const apiServer = new Elysia({
    serve: { tls: { cert: file(cert), key: file(key) } },
  })
    .use(
      swagger({
        documentation: {
          info: {
            title: 'Meshsrv API Documentation',
            version: '1.0.0',
          },
        },
      })
    )
    .use(authRoute)
    .use(userRoute);

  CURRENT_SERVER = apiServer.server;
  return apiServer.listen(Bun.env.API_SERVER_PORT || 3090);
}
