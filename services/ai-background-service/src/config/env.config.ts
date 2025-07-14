import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // AI
    STABILITY_API_KEY: z.string({ required_error: 'STABILITY_API_KEY is required' }),
    OPENAI_API_KEY: z.string({ required_error: 'OPENAI_API_KEY is required' }),

    // Server
    PORT: z.coerce.number().default(8000),
    APP_ENV: z.enum(['development', 'production', 'dev', 'staging']).default('dev'),

    // Databases
    HEALTH_FOOD_BLOG_DATABASE_URL: z.string({
      required_error: 'HEALTH_FOOD_BLOG_DATABASE_URL is required',
    }),

    // Redis
    REDIS_URL: z.string({ required_error: 'REDIS_URL is required' }),

    // supabase
    SUPABASE_URL: z.string({ required_error: 'SUPABASE_URL is required' }),
    SUPABASE_KEY: z.string({ required_error: 'SUPABASE_KEY is required' }),
    SUPABASE_BUCKET_IMAGES_URL: z.string({
      required_error: 'SUPABASE_BUCKET_IMAGES_URL is required',
    }),
  },
  runtimeEnvStrict: {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PORT: process.env.PORT,
    APP_ENV: process.env.APP_ENV,
    HEALTH_FOOD_BLOG_DATABASE_URL: process.env.HEALTH_FOOD_BLOG_DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_BUCKET_IMAGES_URL: process.env.SUPABASE_BUCKET_IMAGES_URL,
  },
});
