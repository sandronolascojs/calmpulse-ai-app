import { ErrorBase } from '@/utils/errors/error.base';
import { logger } from '@/utils/logger.instance';
import type { FastifyPluginAsync } from 'fastify';

export const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    // Known custom error
    if (error instanceof ErrorBase) {
      logger.error(error.message, {
        path: request.url,
        userId: request.user.id,
        statusCode: error.statusCode,
        error: error.message,
        requestId: request.id,
        ip: request.ip,
      });
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    logger.error(error.message, {
      path: request.url,
      userId: request.user.id,
      statusCode: 500,
      error: error instanceof Error ? error.message : String(error),
      requestId: request.id,
      ip: request.ip,
    });

    return reply.status(500).send({
      message: 'Internal Server Error',
    });
  });
};
