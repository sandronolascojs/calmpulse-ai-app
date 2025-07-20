import { workspaceMembers, type InsertWorkspaceMember } from '@calmpulse-app/db/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import { and, eq } from 'drizzle-orm';

export class WorkspaceMemberRepository extends BaseRepository {
  async getWorkspaceMembers({ workspaceId }: { workspaceId: string }) {
    const members = await this.db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
    });
    return members;
  }

  async getSlackMember({
    workspaceId,
    workspaceMemberId,
  }: {
    workspaceId: string;
    workspaceMemberId: string;
  }) {
    const slackMember = await this.db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.workspaceMemberId, workspaceMemberId),
      ),
    });
    return slackMember;
  }

  async createWorkspaceMember(values: InsertWorkspaceMember) {
    const [created] = await this.db.insert(workspaceMembers).values(values).returning();
    return created;
  }

  async createWorkspaceMembersBulk(values: InsertWorkspaceMember[]) {
    await this.db.insert(workspaceMembers).values(values).onConflictDoNothing();
  }
}
