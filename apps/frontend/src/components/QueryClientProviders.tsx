'use client';

import { queryClient } from '@/lib/query-client';
import { tsrClient } from '@/lib/tsr-client';
import { QueryClientProvider } from '@tanstack/react-query';

export const QueryClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <tsrClient.ReactQueryProvider>{children}</tsrClient.ReactQueryProvider>
    </QueryClientProvider>
  );
};
