'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

interface ThemeProviderProps extends React.ComponentProps<typeof NextThemesProvider> {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
