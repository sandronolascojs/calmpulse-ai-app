import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  },
  runtimeEnv: process.env,
});
