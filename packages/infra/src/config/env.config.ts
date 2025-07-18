import { z } from 'zod';

const _envSchema = z
  .object({
    SST_STAGE: z.enum(['dev', 'production']).default('dev'),
    FRONTEND_URL: z.string(),

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

    // cloudflare
    CLOUDFLARE_API_TOKEN: z.string({
      required_error: 'CLOUDFLARE_API_TOKEN is required',
    }),
    CLOUDFLARE_DEFAULT_ACCOUNT_ID: z.string({
      required_error: 'CLOUDFLARE_DEFAULT_ACCOUNT_ID is required',
    }),
  })
  .safeParse(process.env);

if (!_envSchema.success) {
  throw new Error(`Invalid environment variables: ${_envSchema.error.message}`);
}

export const env = _envSchema.data;
