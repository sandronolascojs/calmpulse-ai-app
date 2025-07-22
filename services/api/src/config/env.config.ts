import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production', 'dev', 'staging']).default('dev'),
    DATABASE_URL: z.string({
      required_error: 'DATABASE_URL is required',
    }),
    ALLOWED_ORIGINS: z.string().default('*'),
    API_BASE_URL: z.string({
      required_error: 'API_BASE_URL is required',
    }),
    FRONTEND_URL: z.string({
      required_error: 'FRONTEND_URL is required',
    }),

    // slack
    SLACK_CLIENT_ID: z.string({
      required_error: 'SLACK_CLIENT_ID is required',
    }),
    SLACK_CLIENT_SECRET: z.string({
      required_error: 'SLACK_CLIENT_SECRET is required',
    }),
    SLACK_SIGNING_SECRET: z.string({
      required_error: 'SLACK_SIGNING_SECRET is required',
    }),
    OAUTH_SCOPES: z.string({
      required_error: 'OAUTH_SCOPES is required',
    }),
    NGROK_SLACK_ENDPOINT: z.string().optional(),

    // auth
    BETTER_AUTH_URL: z.string({
      required_error: 'BETTER_AUTH_URL is required',
    }),
    BETTER_AUTH_SECRET: z.string({
      required_error: 'BETTER_AUTH_SECRET is required',
    }),

    // email
    RESEND_API_KEY: z.string({
      required_error: 'RESEND_API_KEY is required',
    }),
    FROM_EMAIL: z.string({
      required_error: 'FROM_EMAIL is required',
    }),

    // google
    GOOGLE_CLIENT_ID: z.string({
      required_error: 'GOOGLE_CLIENT_ID is required',
    }),
    GOOGLE_CLIENT_SECRET: z.string({
      required_error: 'GOOGLE_CLIENT_SECRET is required',
    }),
  },
  runtimeEnvStrict: {
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    API_BASE_URL: process.env.API_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    OAUTH_SCOPES: process.env.OAUTH_SCOPES,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    NGROK_SLACK_ENDPOINT: process.env.NGROK_SLACK_ENDPOINT,
  },
});
