import { db } from '@/db';
import { serverTable } from '@/db/schema';
import type { BasicData } from '@/models/agent';
import { notify } from '@/util/notification';
import { eq } from 'drizzle-orm';
import { t, type Static } from 'elysia';

// TODO: Define more specific type for agent messages
export const agentMsgSchema = t.Object({
  type: t.String(),
  data: t.Any(),
});
export type AgentMsg = Static<typeof agentMsgSchema>;

export async function handleAgentMsg(msg: AgentMsg, ip: string): Promise<Object | undefined> {
  if (msg.type === 'online') {
    const spec = msg.data as BasicData;

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
        // TODO: i18n
        title: `${spec.osInfo.hostname} (${ip}) 已上线`,
      },
    });
    return;
  }

  if (msg.type === 'offline') {
    const v = msg.data as { uuid: string };
    await db
      .update(serverTable)
      .set({ latestReportOffline: new Date() })
      .where(eq(serverTable.id, v.uuid));
    return;
  }
}
