import { env } from '@/config/env';
import { contract } from '@calmpulse-app/ts-rest';
import { ApiFetcherArgs, tsRestFetchApi } from '@ts-rest/core';
import { initTsrReactQuery, isFetchError } from '@ts-rest/react-query/v5';
import { toast } from 'sonner';

export const errorHandler = (error: unknown) => {
  if (isFetchError(error)) {
    toast.error(error.message);
  }
  toast.error('Something went wrong. Please try again later.');
};

// Client-side TSR client (browser: cookies sent automatically)
export const tsrClient = initTsrReactQuery(contract, {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

// Server-side TSR client factory (SSR/API routes)
// Usage: const serverTsrClient = await createServerTsrClient(cookieString);
export const createServerTsrClient = async (cookie: string) => {
  return initTsrReactQuery(contract, {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    baseHeaders: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    api: async (args: ApiFetcherArgs) => {
      return tsRestFetchApi({
        ...args,
        headers: {
          ...args.headers,
          ...(cookie ? { cookie } : {}),
        },
      });
    },
  });
};
