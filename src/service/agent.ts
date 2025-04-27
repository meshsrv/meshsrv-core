import { db } from '@/db';
import { serverTable } from '@/db/schema';
import type { BasicData } from '@/models/agent';
import { notify } from '@/util/notification';
import { eq } from 'drizzle-orm';
import { t, type Static } from 'elysia';

// TODO: Define more specific type for agent messages
export const agentMsgItemSchema = t.Object({
  type: t.String(),
  payload: t.Any(),
});
export type AgentMsgItem = Static<typeof agentMsgItemSchema>;

export async function handleAgentMsg(msg: AgentMsgItem, ip: string): Promise<Object | undefined> {
  if (msg.type === 'online') {
    const spec = msg.payload as BasicData;

    const server = await db.query.serverTable.findFirst({
      where: (server, { eq }) => eq(server.id, spec.uuid),
    });
    if (server) {
      await db
        .update(serverTable)
        .set({ spec, latestPing: new Date() })
        .where(eq(serverTable.id, spec.uuid));
    } else {
      await db.insert(serverTable).values({ id: spec.uuid, spec, latestPing: new Date() });
    }

    notify({
      level: 'success',
      data: {
        type: 'message',
        // TODO: i18n, should be placed in frontend?
        title: `${spec.osInfo.hostname}${ip ? ` (${ip})` : ''} 已上线`,
      },
    });
    return;
  }

  if (msg.type === 'offline') {
    const v = msg.payload as { uuid: string };
    await db
      .update(serverTable)
      .set({ latestReportOffline: new Date() })
      .where(eq(serverTable.id, v.uuid));
    return;
  }
}
