import { InsertSlackOauthStoreState, slackOauthStoreState } from '@calmpulse-app/db/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import { eq } from 'drizzle-orm';

export class SlackOauthStoreStateRepository extends BaseRepository {
  async createOauthStoreState(oauthStoreStateValues: InsertSlackOauthStoreState) {
    return await this.db.insert(slackOauthStoreState).values(oauthStoreStateValues);
  }

  async getByState({ state }: { state: string }) {
    return await this.db.query.slackOauthStoreState.findFirst({
      where: eq(slackOauthStoreState.state, state),
    });
  }

  async getByUserId({ userId }: { userId: string }) {
    return await this.db.query.slackOauthStoreState.findFirst({
      where: eq(slackOauthStoreState.userId, userId),
    });
  }

  async deleteByUserId({ userId }: { userId: string }) {
    return await this.db
      .delete(slackOauthStoreState)
      .where(eq(slackOauthStoreState.userId, userId));
  }

  async deleteByState({ state }: { state: string }) {
    return await this.db.delete(slackOauthStoreState).where(eq(slackOauthStoreState.state, state));
  }
}
