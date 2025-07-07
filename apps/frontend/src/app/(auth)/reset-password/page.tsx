import { ResetPasswordView } from '@/modules/auth/views/ResetPasswordView';

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams.token ?? '';
  return <ResetPasswordView token={token} />;
}
