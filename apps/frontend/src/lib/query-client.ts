import { QueryCache, QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { errorHandler } from './tsr-client';

const ONE_MINUTE = 60 * 1000;
const RETRY_COUNT = 1;

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      retry: RETRY_COUNT,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      errorHandler(error);
    },
  }),
};

export const queryClient = new QueryClient(config);
