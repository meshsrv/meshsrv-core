import swagger from '@elysiajs/swagger';
import { file } from 'bun';
import { Elysia } from 'elysia';
import { authRoute } from './route/auth';
import { userRoute } from './route/user';

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

  return apiServer.listen(Bun.env.API_SERVER_PORT || 3090);
}
