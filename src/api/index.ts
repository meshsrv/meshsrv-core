import type { Nullable } from '@/util/type';
import swagger from '@elysiajs/swagger';
import { file } from 'bun';
import { Elysia } from 'elysia';
import type { Server } from 'elysia/universal';
import { authRoute } from './route/auth';
import { notificationRoute } from './route/notification';
import { userRoute } from './route/user';

let CURRENT_SERVER: Nullable<Server> = null;

export function getCurrentServer() {
  return CURRENT_SERVER;
}

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
    .use(userRoute)
    .use(notificationRoute)
    .listen(Bun.env.API_SERVER_PORT || 3090);

  CURRENT_SERVER = apiServer.server;
  return apiServer;
}
