let AGENT_SECRET = '';

export async function getAgentSecret(): Promise<string> {
  if (AGENT_SECRET) return AGENT_SECRET;

  const file = Bun.file('agent.secret');
  if (!(await file.exists())) {
    AGENT_SECRET = crypto.randomUUID();
    await file.write(AGENT_SECRET);
  } else {
    AGENT_SECRET = await file.text();
  }
  return AGENT_SECRET;
}
