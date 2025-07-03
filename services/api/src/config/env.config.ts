import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production']).default('development'),
    HEALTH_FOOD_BLOG_DATABASE_URL: z.string({
      required_error: 'HEALTH_FOOD_BLOG_DATABASE_URL is required',
    }),
    SUPABASE_BUCKET_IMAGES_URL: z.string({
      required_error: 'SUPABASE_BUCKET_IMAGES_URL is required',
    }),
    ALLOWED_ORIGINS: z.string().default('*'),
  },
  runtimeEnvStrict: {
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    HEALTH_FOOD_BLOG_DATABASE_URL: process.env.HEALTH_FOOD_BLOG_DATABASE_URL,
    SUPABASE_BUCKET_IMAGES_URL: process.env.SUPABASE_BUCKET_IMAGES_URL,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  },
});
