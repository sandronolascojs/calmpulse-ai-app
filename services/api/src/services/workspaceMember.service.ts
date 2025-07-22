import { WorkspaceMemberRepository } from '@/repositories/workspaceMemberRepository';
import type { DB } from '@calmpulse-app/db';
import type { InsertWorkspaceMember } from '@calmpulse-app/db/schema';
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
    return this.workspaceMemberRepository.createWorkspaceMembersBulk(values);
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
    name,
    email,
    avatarUrl,
    title,
  }: {
    workspaceMemberId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    title: string | null;
  }) {
    return this.workspaceMemberRepository.updateWorkspaceMember({
      workspaceMemberId,
      name,
      email,
      avatarUrl,
      title,
    });
  }
}
