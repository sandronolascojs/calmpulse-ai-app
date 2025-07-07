import { QUERY_KEYS } from '@/constants/queryKeys.constants';
import { tsrClient } from '@/lib/tsr-client';
import { DashboardView } from '@/modules/dashboard/views/DashboardView';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function DashboardPage() {
  const queryClient = new QueryClient();
  const queryKey = QUERY_KEYS.WORKSPACE.GET_USER_WORKSPACE();
  const tsrQueryClient = tsrClient.initQueryClient(queryClient);
  await tsrQueryClient.workspaceContract.getUserWorkspace.prefetchQuery({ queryKey });
  const dehydratedState = dehydrate(tsrQueryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardView />
    </HydrationBoundary>
  );
}
