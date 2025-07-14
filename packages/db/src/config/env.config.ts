import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    APP_ENV: z.enum(['development', 'production', 'dev', 'staging']).default('dev'),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    APP_ENV: process.env.APP_ENV,
  },
  clientPrefix: '',
});
