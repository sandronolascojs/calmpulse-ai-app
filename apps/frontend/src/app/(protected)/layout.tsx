import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  if (!session) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
