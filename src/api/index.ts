import swagger from '@elysiajs/swagger';
import { file } from 'bun';
import { Elysia } from 'elysia';
import { authRoute } from './route/auth';
import { userRoute } from './route/user';

export const apiServer = new Elysia({
  serve: {
    tls: {
      cert: file('cert.pem'),
      key: file('key.pem'),
    },
  },
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
