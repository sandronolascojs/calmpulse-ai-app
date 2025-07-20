import { auth } from '@/auth/auth';
import { logger } from '@/utils/logger.instance';
import { FastifyInstance } from 'fastify';

export async function registerAuthController(fastify: FastifyInstance) {
  fastify.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });
        const response = await auth.handler(req);

        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));

        if (response.status !== 302) {
          reply.send(response.body ? await response.text() : null);
        }
      } catch (error) {
        logger.error('Better Auth Handler Error:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_HANDLER_FAILURE',
        });
      }
    },
  });
}
