import { UserRepository } from '@/repositories/userRepository.js';
import type { DB } from '@calmpulse-app/db';
import type { Logger } from '@calmpulse-app/shared';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(db: DB, logger: Logger) {
    this.userRepository = new UserRepository(db, logger);
  }

  async getUserById({ userId }: { userId: string }) {
    return this.userRepository.getUserById({ userId });
  }
}
