import { db } from '@calmpulse-app/db';
import { users } from '@calmpulse-app/db/src/schema';
import { BaseRepository } from '@calmpulse-app/shared';
import { eq } from 'drizzle-orm';

export class UserRepository extends BaseRepository {
  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  }

  async getUserById({ userId }: { userId: string }) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    return user;
  }
}
