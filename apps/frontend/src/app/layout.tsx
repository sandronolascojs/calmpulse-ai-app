import { QueryClientProviders } from '@/components/QueryClientProviders';
import { ThemeProvider } from '@/components/ThemeProvider';
import { APP } from '@/constants/app.constants';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP.name,
  description: APP.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, inter.className, 'antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme={APP.theme.defaultTheme}
          enableSystem
          disableTransitionOnChange
          storageKey={APP.theme.localStorageKey}
        >
          <QueryClientProviders>{children}</QueryClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
