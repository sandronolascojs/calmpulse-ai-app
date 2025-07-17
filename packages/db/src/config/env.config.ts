import { z } from 'zod';

const envSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    APP_ENV: z.enum(['development', 'production', 'dev', 'staging']).default('dev'),
  })
  .safeParse(process.env);

if (!envSchema.success) {
  throw new Error(`Invalid environment variables: ${envSchema.error.message}`);
}

export const env = envSchema.data;
