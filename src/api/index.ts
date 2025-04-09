import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { authRoute } from './route/auth';
import { userRoute } from './route/user';

export const apiServer = new Elysia()
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
