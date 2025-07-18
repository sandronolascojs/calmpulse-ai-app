import { awsLambdaFastify } from '@fastify/aws-lambda';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { initServer } from '@ts-rest/fastify';
import fastify from 'fastify';

import { corsConfig } from './config/cors.config.js';
import { env } from './config/env.config.js';
import { rateLimitConfig } from './config/rateLimit.config.js';
import { registerAuthController } from './controllers/auth.controller.js';
import { publicController } from './controllers/public.controller.js';
import { slackController } from './controllers/slack.controller.js';
import { workspaceController } from './controllers/workspace.controller.js';
import { authPlugin } from './plugins/auth.plugin.js';
import { errorHandlerPlugin } from './plugins/errorHandler.plugin.js';
import { requestHandlerPlugin } from './plugins/requestHandler.plugin.js';
import { logger } from './utils/logger.instance.js';

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

const proxy = awsLambdaFastify(buildServer());
export const handler = proxy;

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  buildServer()
    .listen({ port: env.PORT, host: '0.0.0.0' })
    .then(() => {
      logger.info(`🚀 API ready at http://localhost:${env.PORT}`);
    })
    .catch((err: unknown) => {
      logger.error('Failed to start API', {
        error: err instanceof Error ? err.message : 'Unknown error',
      });
      process.exit(1);
    });
}
