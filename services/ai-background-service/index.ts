import { fastifySchedule } from '@fastify/schedule';
import fastify from 'fastify';
import { env } from './src/config/env.config';

const server = fastify();
server.register(fastifySchedule);

server.ready().then(async () => {});

server.get('/health', () => {
  return {
    status: 200,
    body: {
      message: 'AI Background Service is running',
    },
  };
});

process.on('SIGTERM', async () => {
  await server.close();
  process.exit(0);
});

server.listen({ port: env.PORT }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
