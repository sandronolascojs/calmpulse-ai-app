import { logger } from '@/utils/logger.instance';
import type { FastifyPluginAsync } from 'fastify';

export const requestHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request) => {
    logger.info('Request received', {
      path: request.url,
      method: request.method,
      requestId: request.id,
      ip: request.ip,
    });
  });

  fastify.setNotFoundHandler((request, reply) => {
    logger.info('Request received (404)', {
      path: request.url,
      method: request.method,
      requestId: request.id,
      ip: request.ip,
    });
    reply.status(404).send({ message: 'Not Found' });
  });
};
