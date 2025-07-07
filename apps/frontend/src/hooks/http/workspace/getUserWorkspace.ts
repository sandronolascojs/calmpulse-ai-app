import { QUERY_KEYS } from '@/constants/queryKeys.constants';
import { errorHandler, tsrClient } from '@/lib/tsr-client';

export const useGetUserWorkspace = () => {
  const queryKey = QUERY_KEYS.WORKSPACE.GET_USER_WORKSPACE();

  const query = tsrClient.workspaceContract.getUserWorkspace.useQuery({
    queryKey,
  });
  console.log(query.data?.body.workspace);

  if (query.isError) {
    errorHandler(query.error);
  }

  return {
    workspace: query.data?.body.workspace,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
