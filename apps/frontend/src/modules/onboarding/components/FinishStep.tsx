import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart2, CheckCircle2, PartyPopper } from 'lucide-react';
import Link from 'next/link';

export const FinishStep = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg md:max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PartyPopper className="size-6 text-primary" />
            You&apos;re all set!
          </CardTitle>
          <CardDescription className="text-base">
            Welcome to CalmPulse. Your team is now ready to thrive with proactive wellness insights
            and world-class security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-base text- font-semibold">
            <CheckCircle2 className="size-5 text-green-500" />
            Success! Your workspace is connected and your onboarding is complete.
          </div>
          <div className="flex items-center gap-3 text-base text-muted-foreground">
            <BarChart2 className="size-5 text-primary" />
            Explore your dashboard for actionable insights, team analytics, and micro-interventions.
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
