import { env } from '@/config/env.config';
import { EmailService } from '@/services/email.service';
import { db } from '@calmpulse-app/db';
import { accounts, sessions, users, verifications } from '@calmpulse-app/db/src/schema';
import { APP_CONFIG } from '@calmpulse-app/types';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { haveIBeenPwned, magicLink } from 'better-auth/plugins';

export const auth = betterAuth({
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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      const { email } = user;
      const resetPasswordUrl = `${url}?token=${token}`;
      const emailService = new EmailService();
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
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        const magicLinkUrl = `${url}?token=${token}`;
        const emailService = new EmailService();
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
