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
import { emailValidation, nameValidation, passwordValidation } from '@calmpulse-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

const signUpSchema = z.object({
  firstName: nameValidation('First name')
    .transform((val) => val.trim())
    .pipe(z.string({ required_error: 'First name is required' })),
  lastName: nameValidation('Last name')
    .transform((val) => val.trim())
    .pipe(z.string({ required_error: 'Last name is required' })),
  email: emailValidation,
  password: passwordValidation,
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleGoogleSignIn = async () => {
    await auth.signIn.social(
      { provider: 'google', callbackURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/dashboard` },
      {
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  };

  const onSubmit = async (data: SignUpFormData) => {
    startTransition(async () => {
      await auth.signUp.email(
        {
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        },
        {
          onSuccess: () => {
            router.push('/');
          },
          onError: (error) => {
            switch (error.error.code) {
              case auth.$ERROR_CODES.INVALID_PASSWORD:
              case auth.$ERROR_CODES.INVALID_EMAIL:
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
        },
      );
    });
  };

  return (
    <AuthCardLayout
      title="Sign up"
      description="Enter your email and password to create your account"
    >
      <div className="grid grid-cols-1 gap-3">
        <SocialLoginButton onClick={handleGoogleSignIn} disabled={isPending}>
          <span className="hidden sm:inline">Sign up with Google</span>
        </SocialLoginButton>
      </div>
      <div className="flex items-center w-full text-xs uppercase text-muted-foreground">
        <div className="flex-1 border-t border-border" />
        <span className="mx-4 px-2">Or sign up with email</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" disabled={isPending} />
                  </FormControl>
                  <FormMessage className="text-destructive text-sm" />
                </FormItem>
              )}
            />
          </div>
          <EmailPasswordFields control={form.control} isPending={isPending} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing up...
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>
      </Form>
      <SwitchableFooter prompt="Already have an account?" linkText="Sign in" linkHref="/sign-in" />
      <TermsFooter />
    </AuthCardLayout>
  );
}
