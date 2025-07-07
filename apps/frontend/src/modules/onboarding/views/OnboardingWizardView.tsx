'use client';

import { useSlackInstall } from '@/hooks/http/slack/useSlackInstall';
import { FinishStep } from '../components/FinishStep';
import { WelcomeStep } from '../components/WelcomeStep';
import { WorkspaceStep } from '../components/WorkspaceStep';
import { OnboardingProvider, useOnboarding } from '../context/OnboardingContext';

const StepRenderer = () => {
  const { steps, currentStepIndex, nextStep } = useOnboarding();
  const { installSlack, isLoading } = useSlackInstall();

  const handleSlackConnect = async () => {
    await installSlack();
    nextStep();
  };

  switch (steps[currentStepIndex].id) {
    case 'welcome':
      return <WelcomeStep />;
    case 'workspace':
      return <WorkspaceStep onSlackConnect={handleSlackConnect} isLoading={isLoading} />;
    case 'finish':
      return <FinishStep />;
    default:
      return null;
  }
};

export const OnboardingWizardView = () => {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <StepRenderer />
      </div>
    </OnboardingProvider>
  );
};
