import { QUERY_KEYS } from '@/constants/queryKeys.constants';
import { createServerTsrClient } from '@/lib/tsr-client';
import { QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const queryKey = QUERY_KEYS.WORKSPACE.GET_USER_WORKSPACE();
  const cookie = (await cookies()).toString();
  const serverTsrClient = await createServerTsrClient(cookie);
  const tsrQueryClient = serverTsrClient.initQueryClient(queryClient);
  const result = await tsrQueryClient.workspaceContract.getUserWorkspace.fetchQuery({
    queryKey,
  });

  if (result.body.workspace) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
