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
export const errorHandler = (error: unknown) => {
  if (isFetchError(error)) {
    toast.error(error.message);
    return;
  }
  toast.error('Something went wrong. Please try again later.');
};
};

export const queryClient = new QueryClient(config);
