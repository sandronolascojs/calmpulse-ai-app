import { SlackOauthStoreStateRepository } from '@/repositories/slackOauthStoreStateRepository';
import { NotFoundError } from '@/utils/errors/NotFoundError';
import type { DB } from '@calmpulse-app/db';
import type { InsertSlackOauthStoreState } from '@calmpulse-app/db/schema';
import type { Logger } from '@calmpulse-app/shared';

export class SlackOauthStoreStateService {
  private slackOauthStoreStateRepository: SlackOauthStoreStateRepository;

  constructor(db: DB, logger: Logger) {
    this.slackOauthStoreStateRepository = new SlackOauthStoreStateRepository(db, logger);
  }

  async createOauthStoreState(oauthStoreStateValues: InsertSlackOauthStoreState) {
    return await this.slackOauthStoreStateRepository.createOauthStoreState(oauthStoreStateValues);
  }

  async getByState({ state }: { state: string }) {
    return await this.slackOauthStoreStateRepository.getByState({ state });
  }

  async getByUserId({ userId }: { userId: string }) {
    return await this.slackOauthStoreStateRepository.getByUserId({ userId });
  }

  async deleteByUserId({ userId }: { userId: string }) {
    const oauthStoreState = await this.getByUserId({ userId });
    if (!oauthStoreState) {
      throw new NotFoundError({
        message: 'Oauth store state not found',
      });
    }
    return await this.slackOauthStoreStateRepository.deleteByUserId({ userId });
  }

  async deleteByState({ state }: { state: string }) {
    const oauthStoreState = await this.getByState({ state });
    if (!oauthStoreState) {
      throw new NotFoundError({
        message: 'Oauth store state not found',
      });
    }
    return await this.slackOauthStoreStateRepository.deleteByState({ state });
  }
}
