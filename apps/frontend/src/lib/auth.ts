import { env } from '@/config/env';
import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const auth = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_API_URL,
  plugins: [magicLinkClient()],
});
