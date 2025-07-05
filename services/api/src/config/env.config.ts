import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production']).default('development'),
    DATABASE_URL: z.string({
      required_error: 'DATABASE_URL is required',
    }),
    SUPABASE_BUCKET_IMAGES_URL: z.string({
      required_error: 'SUPABASE_BUCKET_IMAGES_URL is required',
    }),
    ALLOWED_ORIGINS: z.string().default('*'),
    API_BASE_URL: z.string({
      required_error: 'API_BASE_URL is required',
    }),

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
  },
  runtimeEnvStrict: {
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    API_BASE_URL: process.env.API_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_BUCKET_IMAGES_URL: process.env.SUPABASE_BUCKET_IMAGES_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    OAUTH_SCOPES: process.env.OAUTH_SCOPES,
  },
});
