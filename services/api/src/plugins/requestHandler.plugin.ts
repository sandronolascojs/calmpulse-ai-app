/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { logger } from '@/utils/logger.instance';
import type { FastifyPluginAsync } from 'fastify';

export const requestHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request) => {
    logger.info('Request received', {
      path: request.url,
      method: request.method,
      requestId: request.id,
      ip: request.ip,
      userId: request.user?.id,
    });
  });

  fastify.setNotFoundHandler((request, reply) => {
    logger.info('Request received (404)', {
      path: request.url,
      method: request.method,
      requestId: request.id,
      ip: request.ip,
      userId: request.user?.id,
    });
    reply.status(404).send({ message: 'Not Found' });
  });
};
