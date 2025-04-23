import { agentMsgItemSchema, handleAgentMsg } from '@/service/agent';
import { Elysia, t } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

const subscribeSchema = t.Object({
  type: t.Literal('subscribe'),
  payload: t.String({ description: 'topic name' }),
});
const unsubscribeSchema = t.Object({
  type: t.Literal('unsubscribe'),
  payload: t.String({ description: 'topic name' }),
});
const dashboardMsgSchema = t.Union([subscribeSchema, unsubscribeSchema]);

export const wsRoute = new Elysia()
  .use(auth)
  .use(response)

  // WebSocket interface for agent
  .ws('/ws/agent', {
    isAgent: true,
    body: t.Array(agentMsgItemSchema),
    async message(ws, message) {
      console.log(`[Agent] ${ws.remoteAddress}`);
      console.log('[');
      message.forEach(async (msg) => {
        console.log('  ' + JSON.stringify(msg));
        const result = await handleAgentMsg(msg, ws.remoteAddress);
        if (result) ws.send(JSON.stringify(result));
      });
      console.log(']');
    },
  })

  // WebSocket interface for dashboard
  .ws('/ws/dashboard', {
    isAuth: true,
    body: dashboardMsgSchema,
    message(ws, message) {
      if (message.type === 'subscribe') {
        if (!ws.isSubscribed(message.payload)) ws.subscribe(message.payload);
        return;
      }

      if (message.type === 'unsubscribe') {
        if (ws.isSubscribed(message.payload)) ws.unsubscribe(message.payload);
        return;
      }

      // TODO: handle other message types
    },
  });
