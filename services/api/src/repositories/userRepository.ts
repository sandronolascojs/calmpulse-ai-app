import { db } from "@calmpulse-app/db";
import { users, userWorkspaces, workspaces } from "@calmpulse-app/db/src/schema";
import { BaseRepository } from "@calmpulse-app/shared"; 
import { eq } from "drizzle-orm";

export class UserRepository extends BaseRepository {
  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  }

  async getUserById({ userId }: { userId: string }) {
    const [user] = await this.db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      role: userWorkspaces.role,
      workspaceId: userWorkspaces.workspaceId,
      workspaceName: workspaces.name,
      workspaceLogoUrl: workspaces.logoUrl,
      workspaceSlug: workspaces.slug,
    })
    .from(users)
    .innerJoin(userWorkspaces, eq(userWorkspaces.userId, users.id))
    .innerJoin(workspaces, eq(userWorkspaces.workspaceId, workspaces.workspaceId))
    .where(eq(users.id, userId))
    .limit(1);
    return user;
  }
}