import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { auth } from "@/auth/auth";
import { UserService } from "@/services/user.service";
import { db } from "@calmpulse-app/db";
import { logger } from "@/utils/logger.instance";
import type { UserRole } from "@calmpulse-app/types";

export interface WorkspaceUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  role: UserRole;
  workspaceId: string;
  workspaceName: string;
  workspaceLogoUrl: string | null;
  workspaceSlug: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: WorkspaceUser;
}

export const authPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorateRequest("user", null as unknown as WorkspaceUser);

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const session = await auth.api.getSession({ headers });
        if (!session || !session.user) {
          return reply.status(401).send({ message: "Unauthorized" });
        }

        const userService = new UserService(db, logger);
        const user = await userService.getUserById({ userId: session.user.id });
        if (!user) {
          return reply.status(401).send({ message: "Unauthorized" });
        }

        request.user = user;
      } catch (error) {
        fastify.log.error("Authentication Error:", error);
        return reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    }
  );
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
  interface FastifyRequest {
    user: WorkspaceUser;
  }
}
