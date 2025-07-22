import { schema } from '@calmpulse-app/db';
import { BaseRepository } from '@calmpulse-app/shared';
import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import { eq } from 'drizzle-orm';

export class SlackRepository extends BaseRepository {
  async upsertWorkspaceToken({
    workspaceId,
    accessToken,
    refreshToken,
    expiresAt,
  }: {
    workspaceId: string;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date | null;
  }) {
    const workspaceToken = await this.db
      .insert(schema.workspaceTokens)
      .values({
        provider: WorkspaceExternalProviderType.Slack,
        workspaceId,
        accessToken,
        refreshToken,
        expiresAt,
        installedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [schema.workspaceTokens.workspaceId],
        set: { accessToken, refreshToken, expiresAt },
      });
    return workspaceToken;
  }

  async getWorkspaceTokenByWorkspaceId({ workspaceId }: { workspaceId: string }) {
    const workspaceToken = await this.db.query.workspaceTokens.findFirst({
      where: eq(schema.workspaceTokens.workspaceId, workspaceId),
    });

    if (workspaceToken?.expiresAt && workspaceToken.expiresAt < new Date()) {
      await this.db
        .delete(schema.workspaceTokens)
        .where(eq(schema.workspaceTokens.workspaceId, workspaceId));
      return undefined;
    }

    return workspaceToken;
  }
}
