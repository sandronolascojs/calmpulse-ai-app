import { InternalError } from '@/utils/errors/InternalError';
import { userWorkspaces, workspaces, type InsertWorkspace } from '@calmpulse-app/db/src/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import { UserRole } from '@calmpulse-app/types';
import { eq } from 'drizzle-orm';

export class WorkspaceRepository extends BaseRepository {
  async createWorkspace({ workspace, userId }: { workspace: InsertWorkspace; userId: string }) {
    const [createdWorkspace] = await this.db.insert(workspaces).values(workspace).returning();
    if (!createdWorkspace) {
      throw new InternalError({
        message: 'Failed to create workspace',
      });
    }
    await this.db.insert(userWorkspaces).values({
      workspaceId: createdWorkspace.workspaceId,
      userId: userId,
      role: UserRole.OWNER,
    });

    return createdWorkspace;
  }

  async getWorkspaceById({ workspaceId }: { workspaceId: string }) {
    const workspace = await this.db.query.workspaces.findFirst({
      where: eq(workspaces.workspaceId, workspaceId),
    });
    return workspace;
  }

  async getWorkspaceByUserId({ userId }: { userId: string }) {
    const [workspace] = await this.db
      .select({
        workspaceId: workspaces.workspaceId,
        name: workspaces.name,
        logoUrl: workspaces.logoUrl,
        slug: workspaces.slug,
        externalId: workspaces.externalId,
        domain: workspaces.domain,
        externalProviderType: workspaces.externalProviderType,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(userWorkspaces, eq(workspaces.workspaceId, userWorkspaces.workspaceId))
      .where(eq(userWorkspaces.userId, userId));

    return workspace;
  }
}
