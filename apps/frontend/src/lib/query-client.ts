import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

const ONE_MINUTE = 60 * 1000;
const RETRY_COUNT = 1;

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      retry: RETRY_COUNT,
    },
  },
};

export const queryClient = new QueryClient(config);
