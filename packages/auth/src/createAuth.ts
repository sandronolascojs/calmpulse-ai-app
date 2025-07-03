import { betterAuth } from "better-auth";
import { db } from "@calmpulse-app/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { users, accounts, sessions, verifications } from "@calmpulse-app/db/src/schema";
import { env } from "./config/env.config";

export interface CreateAuthOptions {
}

export const createAuth = (_options?: CreateAuthOptions) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: users,
        account: accounts,
        session: sessions,
        verification: verifications,
      },
      usePlural: true,
    }),
    trustedOrigins: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  });