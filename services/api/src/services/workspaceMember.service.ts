import { WorkspaceMemberRepository } from '@/repositories/workspaceMemberRepository';
import type { DB } from '@calmpulse-app/db';
import type { InsertWorkspaceMember, UpdateWorkspaceMember } from '@calmpulse-app/db/schema';
import type { Logger } from '@calmpulse-app/shared';

export class WorkspaceMemberService {
  private workspaceMemberRepository: WorkspaceMemberRepository;

  constructor(db: DB, logger: Logger) {
    this.workspaceMemberRepository = new WorkspaceMemberRepository(db, logger);
  }

  async getWorkspaceMembers({ workspaceId }: { workspaceId: string }) {
    return this.workspaceMemberRepository.getWorkspaceMembers({ workspaceId });
  }

  async getSlackMember({
    workspaceId,
    workspaceMemberId,
  }: {
    workspaceId: string;
    workspaceMemberId: string;
  }) {
    return this.workspaceMemberRepository.getMember({ workspaceId, workspaceMemberId });
  }

  async createWorkspaceMembers(values: InsertWorkspaceMember[]) {
    return await this.workspaceMemberRepository.createWorkspaceMembersBulk(values);
  }

  async getWorkspaceMemberByExternalUserId({
    externalUserId,
    workspaceId,
  }: {
    externalUserId: string;
    workspaceId: string;
  }) {
    return this.workspaceMemberRepository.getWorkspaceMemberByExternalUserId({
      externalUserId,
      workspaceId,
    });
  }

  async updateWorkspaceMember({
    workspaceMemberId,
    workspaceMember,
  }: {
    workspaceMemberId: string;
    workspaceMember: UpdateWorkspaceMember;
  }) {
    const updatedWorkspaceMember = await this.workspaceMemberRepository.updateWorkspaceMember({
      workspaceMemberId,
      workspaceMember,
    });
    return updatedWorkspaceMember;
  }
}
