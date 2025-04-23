import { getCurrentServer } from '@/api';

export function dashboardTopic(topic: string) {
  return `dashboard/${topic}`;
}

export function agentTopic(topic: string) {
  return `agent/${topic}`;
}

export function publishToDashboard(topic: string, payload: Object) {
  const server = getCurrentServer();
  if (server) {
    server.publish(dashboardTopic(topic), JSON.stringify({ topic, payload }));
  } else {
    console.error(
      `No server instance available to publish message to topic: ${dashboardTopic(topic)}`
    );
  }
}

export function publishToAgent(topic: string, payload: Object) {
  const server = getCurrentServer();
  if (server) {
    server.publish(agentTopic(topic), JSON.stringify({ topic, payload }));
  } else {
    console.error(`No server instance available to publish message to topic: ${agentTopic(topic)}`);
  }
}
