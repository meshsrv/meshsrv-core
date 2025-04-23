import { Elysia } from 'elysia';
import { authRoute } from './auth';
import { notificationRoute } from './notification';
import { serverRoute } from './server';
import { userRoute } from './user';
import { wsRoute } from './ws';

export const route = new Elysia()
  .use(authRoute)
  .use(notificationRoute)
  .use(serverRoute)
  .use(userRoute)
  .use(wsRoute);
