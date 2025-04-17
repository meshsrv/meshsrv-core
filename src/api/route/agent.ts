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
      const result = await handleAgentMsg(message, ws.remoteAddress);
      if (result) ws.send(JSON.stringify(result));
    },
  });
