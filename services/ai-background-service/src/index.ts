import { env } from '@/config/env.config';
import { fastifySchedule } from '@fastify/schedule';
import fastify from 'fastify';

const server = fastify();
server.register(fastifySchedule);

server.ready().then(async () => {
  server.log.info('AI Background Service is running');
});

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
