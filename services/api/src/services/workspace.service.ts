import type { AuthenticatedUser } from '@/plugins/auth.plugin.js';
import { WorkspaceRepository } from '@/repositories/workspaceRepository.js';
import { ConflictError } from '@/utils/errors/ConflictError.js';
import { NotFoundError } from '@/utils/errors/NotFoundError.js';
import type { DB } from '@calmpulse-app/db';
import type { InsertWorkspace } from '@calmpulse-app/db/schema';
import type { Logger } from '@calmpulse-app/shared';

export class WorkspaceService {
  private readonly workspaceRepository: WorkspaceRepository;

  constructor(db: DB, logger: Logger) {
    this.workspaceRepository = new WorkspaceRepository(db, logger);
  }

  async createWorkspace({
    workspace,
    authenticatedUser,
  }: {
    workspace: InsertWorkspace;
    authenticatedUser: AuthenticatedUser;
  }) {
    if (authenticatedUser.workspace) {
      throw new ConflictError({
        message: 'You already have a workspace.',
      });
    }
    const createdWorkspace = await this.workspaceRepository.createWorkspace({
      workspace,
      userId: authenticatedUser.user.id,
    });
    return createdWorkspace;
  }

  async getWorkspaceById({ workspaceId }: { workspaceId: string }) {
    const workspace = await this.workspaceRepository.getWorkspaceById({ workspaceId });

    if (!workspace) {
      throw new NotFoundError({
        message: 'Workspace not found.',
      });
    }

    return workspace;
  }

  async getWorkspaceByUserId({ userId }: { userId: string }) {
    const workspace = await this.workspaceRepository.getWorkspaceByUserId({ userId });
    return workspace;
  }
}
