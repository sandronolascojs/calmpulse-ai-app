import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SmilePlus, Sparkles } from 'lucide-react';

interface WelcomeStepProps {
  nextStep: () => void;
}

export const WelcomeStep = ({ nextStep }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg md:max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <SmilePlus className="size-6 text-primary" />
            Welcome to CalmPulse AI
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Supercharge your team&apos;s well-being and performance with real-time insights,
            AI-powered nudges, and a culture of care. CalmPulse helps modern teams thrive—happier,
            healthier, and more productive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <Sparkles className="size-5 text-primary" />
            Join forward-thinking leaders building resilient, high-performing teams.
          </div>
          <div className="text-muted-foreground text-center">
            Get started in minutes—no complex setup, just actionable insights and a better workday
            for everyone.
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={nextStep}>
            Get Started & Connect
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
