import { env } from '@/config/env.config';
import { EmailService } from '@/services/email.service';
import { db } from '@calmpulse-app/db';
import * as schema from '@calmpulse-app/db/src/schema';
import { APP_CONFIG } from '@calmpulse-app/types';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { haveIBeenPwned, magicLink } from 'better-auth/plugins';

const emailService = new EmailService();

const cacheTTL = 5 * 60 * 1000; // 5 minutes
const TTL = 60 * 60 * 1000; // 1 hour

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: cacheTTL,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  rateLimit: {
    enabled: true,
    trustProxy: true,
    max: 100,
    ttl: TTL,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  trustedOrigins: env.ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      const { email } = user;
      const resetPasswordUrl = `${url}?token=${token}`;
      await emailService.sendEmail({
        to: email,
        subject: `${APP_CONFIG.basics.name} - Reset your password`,
        html: `Click <a href="${resetPasswordUrl}">here</a> to reset your password`,
      });
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        const magicLinkUrl = `${url}?token=${token}`;
        await emailService.sendEmail({
          to: email,
          subject: `${APP_CONFIG.basics.name} - Magic link`,
          html: `Click <a href="${magicLinkUrl}">here</a> to login`,
        });
      },
      disableSignUp: true,
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        'This password has been compromised in a data breach. Please choose a different password.',
    }),
  ],
});
