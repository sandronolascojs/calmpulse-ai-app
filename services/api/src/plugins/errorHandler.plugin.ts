import { ErrorBase } from '@/utils/errors/error.base';
import { logger } from '@/utils/logger.instance';
import type { FastifyPluginAsync } from 'fastify';

export const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    if (error instanceof ErrorBase) {
      reply.status(error.statusCode).send({
        message: error.message,
      });
      logger.error(error.message, {
        path: request.url,
        userId: request.user?.id,
        statusCode: error.statusCode,
        error: error.message,
        requestId: request.id,
        ip: request.ip,
      });
    }
  });
};
