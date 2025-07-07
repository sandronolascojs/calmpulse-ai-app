import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

type OnboardingContextType = {
  steps: OnboardingStep[];
  currentStepIndex: number;
  currentStep: OnboardingStep;
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStepCompleted: (index: number, completed: boolean) => void;
  goToStepById: (id: string) => void;
};

const defaultSteps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Welcome to CalmPulse!', completed: false },
  {
    id: 'workspace',
    title: 'Connect your workspace',
    description: 'Get started with your team.',
    completed: false,
  },
  { id: 'finish', title: 'Finish', description: "You're all set!", completed: false },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
  initialSteps?: OnboardingStep[];
}

export const OnboardingProvider = ({ children, initialSteps }: OnboardingProviderProps) => {
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps || defaultSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const goToStepById = (id: string) => {
    const idx = steps.findIndex((step) => step.id === id);
    if (idx !== -1) {
      setCurrentStepIndex(idx);
    }
  };

  const nextStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === currentStepIndex ? { ...step, completed: true } : step)),
    );
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const setStepCompleted = (index: number, completed: boolean) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, i) => (i === index ? { ...step, completed } : step)),
    );
  };

  const value: OnboardingContextType = {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    goToStep,
    nextStep,
    prevStep,
    setStepCompleted,
    goToStepById,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
