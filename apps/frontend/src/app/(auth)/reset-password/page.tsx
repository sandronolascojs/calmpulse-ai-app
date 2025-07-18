import { ResetPasswordView } from '@/modules/auth/views/ResetPasswordView';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  return <ResetPasswordView token={token ?? ''} />;
}
