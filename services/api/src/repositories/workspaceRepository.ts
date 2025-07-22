import {
  userWorkspaces,
  workspaces,
  workspaceTokens,
  type InsertWorkspace,
  type UpdateWorkspace,
} from '@calmpulse-app/db/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import { UserRole } from '@calmpulse-app/types';
import { eq } from 'drizzle-orm';

export class WorkspaceRepository extends BaseRepository {
  async createWorkspace({ workspace, userId }: { workspace: InsertWorkspace; userId: string }) {
    const [createdWorkspace] = await this.db.insert(workspaces).values(workspace).returning();

    if (!createdWorkspace) {
      throw new Error('Failed to create workspace');
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
        isDisabled: workspaces.isDisabled,
        deactivationReason: workspaces.deactivationReason,
        deactivatedAt: workspaces.deactivatedAt,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(userWorkspaces, eq(workspaces.workspaceId, userWorkspaces.workspaceId))
      .where(eq(userWorkspaces.userId, userId));

    return workspace;
  }

  async getWorkspaceByExternalId({ externalId }: { externalId: string }) {
    const workspace = await this.db.query.workspaces.findFirst({
      where: eq(workspaces.externalId, externalId),
    });
    return workspace;
  }

  async getWorkspaceTokenByWorkspaceId({ workspaceId }: { workspaceId: string }) {
    const workspaceToken = await this.db.query.workspaceTokens.findFirst({
      where: eq(workspaceTokens.workspaceId, workspaceId),
    });
    return workspaceToken;
  }

  async updateWorkspace({
    workspaceId,
    workspace,
  }: {
    workspaceId: string;
    workspace: UpdateWorkspace;
  }) {
    await this.db
      .update(workspaces)
      .set({
        ...workspace,
        updatedAt: new Date(),
      })
      .where(eq(workspaces.workspaceId, workspaceId));
  }
}
