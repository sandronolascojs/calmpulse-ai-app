import { WorkspaceMemberRepository } from '@/repositories/workspaceMemberRepository.js';
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
    return this.workspaceMemberRepository.getSlackMember({ workspaceId, workspaceMemberId });
  }

  async createWorkspaceMembers(values: InsertWorkspaceMember[]) {
    return this.workspaceMemberRepository.createWorkspaceMembersBulk(values);
  }
}
