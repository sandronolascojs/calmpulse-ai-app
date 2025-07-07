import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const FinishStep = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-xl bg-gradient-to-br from-[#18181b]/80 to-[#23272f]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-0 animate-fade-in relative overflow-hidden">
        {/* Confetti or celebratory effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Sparkles className="absolute top-6 left-6 text-primary size-10 animate-pulse" />
          <Sparkles className="absolute bottom-6 right-6 text-purple-500 size-8 animate-pulse" />
        </div>
        <CardHeader className="pb-0 z-10 relative">
          <div className="flex items-center gap-4 mb-2">
            <Sparkles className="text-primary size-10 animate-bounce" />
            <CardTitle className="text-3xl font-extrabold tracking-tight text-white">
              You&apos;re all set!
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground mb-2">
            Welcome to CalmPulse. Your team is now ready to thrive with proactive wellness insights
            and world-class security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-2 pb-0 z-10 relative">
          <div className="flex items-center gap-3 text-base text-white/90">
            <CheckCircle2 className="size-5 text-primary" />
            <span>Enjoy actionable dashboards, micro-interventions, and more.</span>
          </div>
          <div className="flex items-center gap-3 text-base text-white/90">
            <ShieldCheck className="size-5 text-primary" />
            <span>Your data is always private and secure.</span>
          </div>
        </CardContent>
        <CardFooter className="pt-4 z-10 relative">
          <Button
            className="w-full text-base font-semibold py-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg hover:from-purple-600 hover:to-primary transition-all duration-200"
            size="lg"
            onClick={() => (window.location.href = '/dashboard')}
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
