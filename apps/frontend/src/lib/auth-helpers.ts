import { QUERY_KEYS } from '@/constants/queryKeys.constants';
import { tsrClient } from '@/lib/tsr-client';
import { QueryClient } from '@tanstack/react-query';

export async function getUserWorkspace() {
  const queryClient = new QueryClient();
  const queryKey = QUERY_KEYS.WORKSPACE.GET_USER_WORKSPACE();
  const tsrQueryClient = tsrClient.initQueryClient(queryClient);
  const result = await tsrQueryClient.workspaceContract.getUserWorkspace.fetchQuery({
    queryKey,
  });
  return result.body.workspace;
}
