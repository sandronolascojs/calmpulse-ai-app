import { WorkspaceService } from '@/services/workspace.service.js';
import { logger } from '@/utils/logger.instance.js';
import { db } from '@calmpulse-app/db';
import { contract } from '@calmpulse-app/ts-rest';
import { initServer } from '@ts-rest/fastify';

const server = initServer();

export const workspaceController = server.router(contract.workspaceContract, {
  getUserWorkspace: {
    handler: async ({ request }) => {
      const user = request.user;
      const workspaceService = new WorkspaceService(db, logger);
      const workspaceFromDb = await workspaceService.getWorkspaceByUserId({
        userId: user.id,
      });

      const workspace = {
        workspaceId: workspaceFromDb.workspaceId,
        name: workspaceFromDb.name,
        slug: workspaceFromDb.slug,
        logoUrl: workspaceFromDb.logoUrl,
        domain: workspaceFromDb.domain,
        createdAt: workspaceFromDb.createdAt.toISOString(),
      };

      return {
        status: 200,
        body: {
          workspace,
        },
      };
    },
  },
});
