import { agentMsgSchema, handleAgentMsg } from '@/service/agent';
import { Elysia } from 'elysia';
import { auth } from '../plugin/auth';
import { response } from '../plugin/response';

export const agentRoute = new Elysia()
  .use(auth)
  .use(response)
  .ws('/ws/agent', {
    isAgent: true,
    body: agentMsgSchema,
    async message(ws, message) {
      message.forEach(async (msg) => {
        const result = await handleAgentMsg(msg, ws.remoteAddress);
        if (result) ws.send(JSON.stringify(result));
      });
    },
  });
