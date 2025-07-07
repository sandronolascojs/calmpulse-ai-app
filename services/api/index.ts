import { registerAuthController } from '@/controllers/auth.controller';
import { publicController } from '@/controllers/public.controller';
import { slackController } from '@/controllers/slack.controller';
import { workspaceController } from '@/controllers/workspace.controller';
import { authPlugin } from '@/plugins/auth.plugin';
import { errorHandlerPlugin } from '@/plugins/errorHandler.plugin';
import { requestHandlerPlugin } from '@/plugins/requestHandler.plugin';
import { logger } from '@/utils/logger.instance';
import cors from '@fastify/cors';
import { initServer } from '@ts-rest/fastify';
import fastify from 'fastify';
import { env } from './src/config/env.config';

const server = fastify();
const tsRestServer = initServer();

server.register(cors, {
  origin: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

server.register(requestHandlerPlugin);
server.register(errorHandlerPlugin);
registerAuthController(server);

// Public routes
server.register(tsRestServer.plugin(publicController));

// Auth routes
server.register(async (fastify) => {
  await fastify.register(authPlugin);

  fastify.register(tsRestServer.plugin(slackController), {
    hooks: {
      preHandler: fastify.authenticate,
    },
  });
  fastify.register(tsRestServer.plugin(workspaceController), {
    hooks: {
      preHandler: fastify.authenticate,
    },
  });
});

server.listen({ port: env.PORT }, (err) => {
  logger.info(`Server is running on port ${env.PORT}`);
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
