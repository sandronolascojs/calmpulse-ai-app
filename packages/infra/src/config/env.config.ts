import { createEnv } from '@t3-oss/env-core';
import 'dotenv/config';
import { z } from 'zod';

export const env = createEnv({
  server: {
    FRONTEND_URL: z.string().url(),

    // slack
    SLACK_CLIENT_ID: z.string({
      required_error: 'SLACK_CLIENT_ID is required',
    }),
    SLACK_CLIENT_SECRET: z.string({
      required_error: 'SLACK_CLIENT_SECRET is required',
    }),
    OAUTH_SCOPES: z.string({
      required_error: 'OAUTH_SCOPES is required',
    }),

    // auth
    BETTER_AUTH_SECRET: z.string({
      required_error: 'BETTER_AUTH_SECRET is required',
    }),
    BETTER_AUTH_URL: z.string({
      required_error: 'BETTER_AUTH_URL is required',
    }),

    // email
    RESEND_API_KEY: z.string({
      required_error: 'RESEND_API_KEY is required',
    }),
    FROM_EMAIL: z.string({
      required_error: 'FROM_EMAIL is required',
    }),

    // google credentials
    GOOGLE_CLIENT_ID: z.string({
      required_error: 'GOOGLE_CLIENT_ID is required',
    }),
    GOOGLE_CLIENT_SECRET: z.string({
      required_error: 'GOOGLE_CLIENT_SECRET is required',
    }),
  },
  runtimeEnv: {
    FRONTEND_URL: process.env.FRONTEND_URL,

    // slack
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    OAUTH_SCOPES: process.env.OAUTH_SCOPES,

    // auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

    // email
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,

    // google credentials
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
});
