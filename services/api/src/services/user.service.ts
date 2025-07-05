import { UserRepository } from '@/repositories/userRepository';
import type { DB } from '@calmpulse-app/db';
import type { Logger } from '@calmpulse-app/utils';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor(db: DB, logger: Logger) {
    this.userRepository = new UserRepository(db, logger);
  }

  async getUserById({ userId }: { userId: string }) {
    return this.userRepository.getUserById({ userId });
  }
}
