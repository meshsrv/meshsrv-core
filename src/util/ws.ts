import { getCurrentServer } from '@/api';

export function publish(topic: string, payload: Object) {
  const server = getCurrentServer();
  if (server) {
    server.publish(topic, JSON.stringify({ topic, payload }));
  } else {
    console.error(`No server instance available to publish message to topic: ${topic}`);
  }
}
