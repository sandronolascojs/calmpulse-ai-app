import {
  workspaceMemberPreferences,
  type InsertWorkspaceMemberPreferences,
  type UpdateWorkspaceMemberPreferences,
} from '@calmpulse-app/db/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import { eq } from 'drizzle-orm';

export class WorkspaceMemberPreferencesRepository extends BaseRepository {
  async getWorkspaceMemberPreferencesByWorkspaceMemberId({
    workspaceMemberId,
  }: {
    workspaceMemberId: string;
  }) {
    const preferences = await this.db.query.workspaceMemberPreferences.findFirst({
      where: eq(workspaceMemberPreferences.workspaceMemberId, workspaceMemberId),
    });
    return preferences;
  }

  async createWorkspaceMemberPreferences(values: InsertWorkspaceMemberPreferences) {
    const [preferences] = await this.db
      .insert(workspaceMemberPreferences)
      .values(values)
      .returning();
    return preferences;
  }

  async updateWorkspaceMemberPreferences({
    workspaceMemberPreferencesId,
    memberPreferences,
  }: {
    workspaceMemberPreferencesId: string;
    memberPreferences: UpdateWorkspaceMemberPreferences;
  }) {
    const [preferences] = await this.db
      .update(workspaceMemberPreferences)
      .set({
        ...memberPreferences,
        updatedAt: new Date(),
      })
      .where(
        eq(workspaceMemberPreferences.workspaceMemberPreferencesId, workspaceMemberPreferencesId),
      )
      .returning();

    return preferences;
  }
}
