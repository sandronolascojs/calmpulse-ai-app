import { ConflictError } from '@/utils/errors/ConflictError';
import type { DB } from '@calmpulse-app/db';
import type {
  InsertWorkspaceMemberPreferences,
  UpdateWorkspaceMemberPreferences,
} from '@calmpulse-app/db/schema';
import type { Logger } from '@calmpulse-app/shared';
import { WorkspaceMemberPreferencesRepository } from '../repositories/workspaceMemberPreferencesRepository';

export class WorkspaceMemberPreferencesService {
  private workspaceMemberPreferencesRepository: WorkspaceMemberPreferencesRepository;

  constructor(db: DB, logger: Logger) {
    this.workspaceMemberPreferencesRepository = new WorkspaceMemberPreferencesRepository(
      db,
      logger,
    );
  }

  async createWorkspaceMemberPreferences(values: InsertWorkspaceMemberPreferences) {
    return await this.workspaceMemberPreferencesRepository.createWorkspaceMemberPreferences(values);
  }

  async createWorkspaceMemberPreferencesBulk(values: InsertWorkspaceMemberPreferences[]) {
    return await this.workspaceMemberPreferencesRepository.createWorkspaceMemberPreferencesBulk(
      values,
    );
  }

  async getWorkspaceMemberPreferencesByWorkspaceMemberId({
    workspaceMemberId,
  }: {
    workspaceMemberId: string;
  }) {
    return await this.workspaceMemberPreferencesRepository.getWorkspaceMemberPreferencesByWorkspaceMemberId(
      { workspaceMemberId },
    );
  }

  async updateWorkspaceMemberPreferences({
    workspaceMemberPreferencesId,
    memberPreferences,
  }: {
    workspaceMemberPreferencesId: string;
    memberPreferences: UpdateWorkspaceMemberPreferences;
  }) {
    return await this.workspaceMemberPreferencesRepository.updateWorkspaceMemberPreferences({
      workspaceMemberPreferencesId,
      memberPreferences,
    });
  }

  async updateMemberPreferencesByWorkspaceMemberId({
    workspaceMemberId,
    memberPreferences,
  }: {
    workspaceMemberId: string;
    memberPreferences: UpdateWorkspaceMemberPreferences;
  }) {
    const preferences = await this.getWorkspaceMemberPreferencesByWorkspaceMemberId({
      workspaceMemberId,
    });
    if (!preferences) {
      throw new ConflictError({
        message: `Workspace member preferences not found. ${workspaceMemberId}`,
      });
    }
    return await this.updateWorkspaceMemberPreferences({
      workspaceMemberPreferencesId: preferences.workspaceMemberPreferencesId,
      memberPreferences,
    });
  }
}
