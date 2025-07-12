import { getUserWorkspace } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const workspace = await getUserWorkspace();

  if (!workspace) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}
