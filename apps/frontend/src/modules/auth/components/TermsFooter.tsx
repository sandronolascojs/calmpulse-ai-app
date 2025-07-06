import { Button } from '@/components/ui/button';

export function TermsFooter() {
  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
        By signing in, you agree to our{' '}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-xs underline hover:text-muted-foreground transition-colors"
        >
          Terms
        </Button>{' '}
        and{' '}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-xs underline hover:text-muted-foreground transition-colors"
        >
          Privacy Policy
        </Button>
      </p>
    </div>
  );
}
