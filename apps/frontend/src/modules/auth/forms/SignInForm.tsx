'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { env } from '@/config/env';
import { auth } from '@/lib/auth';
import { emailValidation, passwordValidation } from '@calmpulse-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
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

const magicLinkSchema = z.object({
  email: emailValidation,
});

type SignInFormData = z.infer<typeof signInSchema>;
type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export function SignInForm() {
  // State
  const [isPending, startTransition] = useTransition();
  const [magicMode, setMagicMode] = useState(false);
  const router = useRouter();

  // Forms
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' },
  });

  // Handlers
  const handleMagicLink = async (data: MagicLinkFormData) => {
    startTransition(async () => {
      await auth.signIn.magicLink(
        { email: data.email, callbackURL: env.NEXT_PUBLIC_FRONTEND_URL },
        {
          onSuccess: () => {
            toast.success('Check your email for a magic login link!');
            setMagicMode(false);
            magicLinkForm.reset();
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      );
    });
  };

  // Renderers
  function renderMagicLinkForm() {
    return (
      <Form {...magicLinkForm}>
        <form onSubmit={magicLinkForm.handleSubmit(handleMagicLink)} className="space-y-4">
          <FormField
            control={magicLinkForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="name@company.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Send magic link
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setMagicMode(false)}
          >
            Back to other login options
          </Button>
        </form>
      </Form>
    );
  }

  function renderPasswordSignInForm() {
    return (
      <>
        <div className="grid grid-cols-1 gap-3">
          <SocialLoginButton onClick={handleGoogleSignIn} disabled={isPending}>
            <span className="hidden sm:inline">Continue with Google</span>
          </SocialLoginButton>
        </div>
        <div className="flex items-center w-full text-xs uppercase text-muted-foreground mt-6 mb-2">
          <div className="flex-1 border-t border-border" />
          <span className="mx-4 px-2">or</span>
          <div className="flex-1 border-t border-border" />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setMagicMode(true)}
        >
          <Mail className="w-4 h-4" />
          Sign in with magic link
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePasswordSignIn)} className="space-y-4">
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
      </>
    );
  }

  // Main render
  return (
    <AuthCardLayout
      title="Sign in"
      description="Enter your email and password to access your account"
    >
      {magicMode ? renderMagicLinkForm() : renderPasswordSignInForm()}
    </AuthCardLayout>
  );
}
