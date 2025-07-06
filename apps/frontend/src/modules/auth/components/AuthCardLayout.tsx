import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AuthCardLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCardLayout({ title, description, children }: AuthCardLayoutProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}
