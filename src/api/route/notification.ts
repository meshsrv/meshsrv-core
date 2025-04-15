import { Elysia } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

export const notificationRoute = new Elysia()
  .use(auth)
  .use(response)
  .ws('/ws/notification', {
    isAuth: true,
    open(ws) {
      if (!ws.isSubscribed('notification')) {
        ws.subscribe('notification');
      }
    },
    close(ws) {
      if (ws.isSubscribed('notification')) {
        ws.unsubscribe('notification');
      }
    },
  });
