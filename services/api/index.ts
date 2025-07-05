import { errorHandlerPlugin } from '@/plugins/errorHandler.plugin';
import { requestHandlerPlugin } from '@/plugins/requestHandler.plugin';
import cors from '@fastify/cors';
import { initServer } from '@ts-rest/fastify';
import { logger } from '@/utils/logger.instance';
import fastify from 'fastify';
import { env } from './src/config/env.config';
import { registerAuthController } from '@/controllers/auth.controller';
import { slackController } from '@/controllers/slack.controller';
import { authPlugin } from '@/plugins/auth.plugin';

const server = fastify();
const tsRestServer = initServer();

server.register(cors, {
  origin: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

server.get('/health', () => {
  return {
    status: 'ok',
  };
});

server.register(requestHandlerPlugin);
server.register(errorHandlerPlugin);
registerAuthController(server);
server.register(async (fastify) => {
  await fastify.register(authPlugin);
  fastify.register(tsRestServer.plugin(slackController));
});


server.listen({ port: env.PORT }, (err) => {
  logger.info(`Server is running on port ${env.PORT}`);
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
