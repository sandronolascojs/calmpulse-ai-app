import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeCheck, Loader2, Lock, Network, ShieldCheck } from 'lucide-react';
import { FaSlack } from 'react-icons/fa';

const terms = [
  {
    icon: <Network className="size-6 text-primary" />,
    title: 'OAuth-Based and Revocable',
    description:
      'Your admin grants permissions once. Tokens can be revoked anytime in Slack App settings.',
  },
  {
    icon: <ShieldCheck className="size-6 text-primary" />,
    title: 'Enterprise-Grade Security',
    description:
      'All data is encrypted in transit (TLS) and at rest, following ISO 27001 and SOC 2 standards.',
  },
  {
    icon: <Lock className="size-6 text-primary" />,
    title: 'Privacy-First Data Handling',
    description:
      'Metadata is stored only for 24 hours to compute daily aggregates. Raw data is purged automatically.',
  },
  {
    icon: <BadgeCheck className="size-6 text-primary" />,
    title: 'Regulatory Compliance',
    description:
      'CalmPulse is GDPR, CCPA, and HIPAA (optionally) compliant, with documented retention and deletion policies.',
  },
];

const Term = ({ term }: { term: (typeof terms)[number] }) => {
  return (
    <div className="flex items-start gap-2">
      {term.icon}
      <div>
        <p className="font-medium">{term.title}</p>
        <p className="text-sm text-muted-foreground">{term.description}</p>
      </div>
    </div>
  );
};
interface WorkspaceStepProps {
  onSlackConnect: () => void;
  isLoading: boolean;
}

/**
 * WorkspaceStep Component
 *
 * This step in the onboarding wizard prompts the administrator to connect their Slack workspace.
 * Highlights security, privacy, and compliance:
 * - OAuth-based integration: tokens are revocable and scoped.
 * - Enterprise-grade encryption: data in transit and at rest.
 * - Privacy-first: only metadata stored temporarily for 24h, then aggregated and purged.
 * - Compliance: GDPR, CCPA, SOC 2, ISO27001 guidelines followed.
 */
export const WorkspaceStep = ({ onSlackConnect, isLoading }: WorkspaceStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg md:max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaSlack className="size-6" />
            Connect Your Slack Workspace
          </CardTitle>
          <CardDescription className="text-base">
            To unlock CalmPulse&apos;s AI-powered insights, integrate Slack via OAuth. We never
            store message contents—only metadata for well-being analysis.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {terms.map((term) => (
            <Term key={term.title} term={term} />
          ))}
        </CardContent>

        <CardFooter>
          <Button onClick={onSlackConnect} disabled={isLoading} className="w-full gap-2">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Connecting...
              </>
            ) : (
              <>
                <FaSlack className="h-5 w-5" />
                Connect Slack
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
