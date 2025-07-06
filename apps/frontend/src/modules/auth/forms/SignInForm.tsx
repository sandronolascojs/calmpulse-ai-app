'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { env } from '@/config/env';
import { auth } from '@/lib/auth';
import { emailValidation, passwordValidation } from '@calmpulse-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthCardLayout } from '../components/AuthCardLayout';
import { EmailPasswordFields } from '../components/EmailPasswordFields';
import { SocialLoginButton } from '../components/SocialLoginButton';
import { SwitchableFooter } from '../components/SwitchableFooter';
import { TermsFooter } from '../components/TermsFooter';

const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleGoogleSignIn = async () => {
    await auth.signIn.social(
      { provider: 'google', callbackURL: env.NEXT_PUBLIC_FRONTEND_URL },
      {
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  };

  const onSubmit = async (data: SignInFormData) => {
    startTransition(async () => {
      await auth.signIn.email(data, {
        onSuccess: () => {
          router.push('/');
        },
        onError: (error) => {
          switch (error.error.code) {
            case auth.$ERROR_CODES.INVALID_PASSWORD:
            case auth.$ERROR_CODES.INVALID_EMAIL:
            case auth.$ERROR_CODES.USER_NOT_FOUND:
              form.setError('email', {
                message: 'Invalid email or password. Please try again.',
              });
              break;
            case 'PASSWORD_COMPROMISED':
              form.setError('password', {
                message: error.error.message,
              });
              break;
            default:
              toast.error(error.error.message);
              break;
          }
        },
      });
    });
  };

  return (
    <AuthCardLayout
      title="Sign in"
      description="Enter your email and password to access your account"
    >
      <div className="grid grid-cols-1 gap-3">
        <SocialLoginButton onClick={handleGoogleSignIn} disabled={isPending}>
          <span className="hidden sm:inline">Continue with Google</span>
        </SocialLoginButton>
      </div>
      <div className="flex items-center w-full text-xs uppercase text-muted-foreground">
        <div className="flex-1 border-t border-border" />
        <span className="mx-4 px-2">Or continue with email</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmailPasswordFields form={form} isPending={isPending} />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-primary hover:text-primary/80"
              disabled={isPending}
              asChild
            >
              <Link href="/forgot-password">Forgot password?</Link>
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
      <SwitchableFooter prompt="Don't have an account?" linkText="Sign Up" linkHref="/sign-up" />
      <TermsFooter />
    </AuthCardLayout>
  );
}
