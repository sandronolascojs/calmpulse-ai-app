import { Button } from '@/components/ui/button';

export function TermsFooter() {
  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
        By signing in, you agree to our{' '}
// At the top of apps/frontend/src/modules/auth/components/TermsFooter.tsx
import Link from 'next/link';
…

export function TermsFooter() {
  return (
    <>
      <Button
        type="button"
        variant="link"
        className="p-0 h-auto text-xs underline hover:text-muted-foreground transition-colors"
        asChild
      >
        <Link href="/terms">Terms</Link>
      </Button>{' '}
      and{' '}
      <Button
        type="button"
        variant="link"
        className="p-0 h-auto text-xs underline hover:text-muted-foreground transition-colors"
        asChild
      >
        <Link href="/privacy">Privacy Policy</Link>
      </Button>
    </>
  );
}
      </p>
    </div>
  );
}
