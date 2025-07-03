import { errorHandlerPlugin } from '@/plugins/errorHandler.plugin';
import { requestHandlerPlugin } from '@/plugins/requestHandler.plugin';
import cors from '@fastify/cors';
//import { initServer } from '@ts-rest/fastify';
import fastify from 'fastify';
import { env } from './src/config/env.config';
import { logger } from '@/utils/logger.instance';

const server = fastify();
//const tsRestServer = initServer();

server.register(cors, {
  origin: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With"
  ],
  credentials: true,
  maxAge: 86400
});

server.get('/health', () => {
  return {
    status: 'ok',
  };
});

server.register(requestHandlerPlugin);
server.register(errorHandlerPlugin);

server.listen({ port: env.PORT }, (err) => {
  logger.info(`Server is running on port ${env.PORT}`);
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
