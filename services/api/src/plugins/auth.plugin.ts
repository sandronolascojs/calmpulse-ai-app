import { auth } from '@/auth/auth';
import { WorkspaceService } from '@/services/workspace.service';
import { logger } from '@/utils/logger.instance';
import { db } from '@calmpulse-app/db';
import type { SelectUser, SelectWorkspace } from '@calmpulse-app/db/src/schema';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export type AuthenticatedUser = {
  user: SelectUser;
  workspace: SelectWorkspace | undefined;
};

const workspaceService = new WorkspaceService(db, logger);

export const authPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorateRequest('user', null as unknown as SelectUser);
  fastify.decorateRequest('workspace', null as unknown as SelectWorkspace);

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const session = await auth.api.getSession({ headers });
        if (!session || !session.user) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        if (!session.user.id) {
          logger.error(
            'Invalid session structure: missing user.id',
            { userId: session?.user?.id ?? null },
          );
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const workspace = await workspaceService.getWorkspaceByUserId({
          userId: session.user.id,
        });

        request.user = {
          ...session.user,
          image: session.user.image || null,
        };

        request.workspace = workspace;
      } catch (error) {
        logger.error('Authentication Error:', { error: JSON.stringify(error) });
        return reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  );
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: SelectUser;
    workspace: SelectWorkspace | undefined;
  }
}
