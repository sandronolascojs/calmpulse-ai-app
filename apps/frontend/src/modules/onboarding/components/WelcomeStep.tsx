import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';

export const WelcomeStep = () => {
  const { nextStep } = useOnboarding();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-xl bg-gradient-to-br from-[#18181b]/80 to-[#23272f]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-0 animate-fade-in">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4 mb-2">
            <ShieldCheck className="text-primary size-10 drop-shadow-lg" />
            <CardTitle className="text-3xl font-extrabold tracking-tight text-white">
              Welcome to CalmPulse
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground mb-2">
            CalmPulse is your enterprise-grade platform for proactive burnout prevention and team
            wellness.
          </CardDescription>
          <div className="mt-2">
            <span className="text-primary font-bold text-base">Security First</span>
            <span className="block text-sm text-muted-foreground mt-1">
              We never store message content. All data is encrypted, privacy-first, and compliant
              with <span className="font-semibold">SOC 2</span>,{' '}
              <span className="font-semibold">GDPR</span>, and{' '}
              <span className="font-semibold">HIPAA</span>.
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-2 pb-0">
          <div className="flex items-center gap-3 text-base text-white/90">
            <Lock className="size-5 text-primary" />
            <span>Strict access controls and row-level security for every workspace.</span>
          </div>
          <div className="flex items-center gap-3 text-base text-white/90">
            <CheckCircle2 className="size-5 text-primary" />
            <span>
              Integrate Slack and Google Calendar in seconds—no sensitive data ever leaves your
              control.
            </span>
          </div>
          <div className="flex items-center gap-3 text-base text-white/90">
            <Sparkles className="size-5 text-primary" />
            <span>
              Actionable insights, micro-interventions, and beautiful dashboards for your team.
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            className="w-full text-base font-semibold py-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg hover:from-purple-600 hover:to-primary transition-all duration-200"
            size="lg"
            onClick={nextStep}
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
