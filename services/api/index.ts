import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { initServer } from '@ts-rest/fastify';
import fastify from 'fastify';

import { corsConfig } from '@/config/cors.config';
import { env } from '@/config/env.config';
import { rateLimitConfig } from '@/config/rateLimit.config';
import { registerAuthController } from '@/controllers/auth.controller';
import { publicController } from '@/controllers/public.controller';
import { slackController } from '@/controllers/slack.controller';
import { workspaceController } from '@/controllers/workspace.controller';
import { authPlugin } from '@/plugins/auth.plugin';
import { errorHandlerPlugin } from '@/plugins/errorHandler.plugin';
import { requestHandlerPlugin } from '@/plugins/requestHandler.plugin';
import { logger } from '@/utils/logger.instance';

export function buildServer() {
  const app = fastify({ logger: true });
  const tsRest = initServer();

  app.register(cors, corsConfig);
  app.register(rateLimit, rateLimitConfig);

  app.register(requestHandlerPlugin);
  app.register(errorHandlerPlugin);

  app.register(registerAuthController);

  app.register(tsRest.plugin(publicController));

  app.register(async (fastify) => {
    await fastify.register(authPlugin);

    fastify.register(tsRest.plugin(slackController), {
      hooks: { preHandler: fastify.authenticate },
    });
    fastify.register(tsRest.plugin(workspaceController), {
      hooks: { preHandler: fastify.authenticate },
    });
  });

  return app;
}

buildServer()
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => logger.info(`🚀 API ready at http://localhost:${env.PORT}`))
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
