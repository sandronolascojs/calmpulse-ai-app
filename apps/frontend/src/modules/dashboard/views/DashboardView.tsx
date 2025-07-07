'use client';

import { useGetUserWorkspace } from '@/hooks/http/workspace/getUserWorkspace';

export const DashboardView = () => {
  const { workspace, isLoading, isError } = useGetUserWorkspace();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: something went wrong</div>;
  return <div>{workspace?.name ?? 'No workspace'}</div>;
};
