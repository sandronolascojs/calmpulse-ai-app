import { getUserWorkspace } from '@/lib/auth-helpers';
import { OnboardingWizardView } from '@/modules/onboarding/views/OnboardingWizardView';
import { redirect } from 'next/navigation';

interface OnboardingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const workspace = await getUserWorkspace();
  const { step } = await searchParams;

  if (workspace && !step) {
    redirect('/');
  }

  return <OnboardingWizardView />;
}
