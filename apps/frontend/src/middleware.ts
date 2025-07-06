import { createAuthClient } from 'better-auth/client';
import { NextRequest, NextResponse } from 'next/server';
import { env } from './config/env';

const client = createAuthClient({
  baseURL: env.NEXT_PUBLIC_AUTH_API_URL,
});

export const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/reset-password-confirm',
  '/verify-email',
  '/verify-email-confirm',
];

export default async function middleware(request: NextRequest) {
  const { data: session } = await client.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  });

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
