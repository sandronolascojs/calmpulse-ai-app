import { env } from '@/config/env';
import { contract } from '@calmpulse-app/ts-rest';
import { ApiFetcherArgs, tsRestFetchApi } from '@ts-rest/core';
import { initTsrReactQuery, isFetchError } from '@ts-rest/react-query/v5';
import { toast } from 'sonner';

export const errorHandler = (error: unknown) => {
  if (isFetchError(error)) {
    toast.error(error.message);
    return;
  }
  toast.error('Something went wrong. Please try again later.');
};

export const tsrClient = initTsrReactQuery(contract, {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  api: async (args: ApiFetcherArgs) => {
    return tsRestFetchApi({
      ...args,
      headers: {
        ...args.headers,
      },
    });
  },
});
