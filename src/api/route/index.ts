import { Elysia } from 'elysia';
import { agentRoute } from './agent';
import { authRoute } from './auth';
import { notificationRoute } from './notification';
import { serverRoute } from './server';
import { userRoute } from './user';

export const route = new Elysia()
  .use(agentRoute)
  .use(authRoute)
  .use(notificationRoute)
  .use(serverRoute)
  .use(userRoute);
