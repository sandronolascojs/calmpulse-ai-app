import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SwitchableFooterProps {
  prompt: string;
  linkText: string;
  linkHref: string;
}

export function SwitchableFooter({ prompt, linkText, linkHref }: SwitchableFooterProps) {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-muted-foreground">
        {prompt}{' '}
        <Button type="button" variant="link" className="p-0 text-primary-foreground" asChild>
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </p>
    </div>
  );
}
