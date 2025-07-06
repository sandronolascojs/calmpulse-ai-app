'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { env } from '@/config/env';
import { APP } from '@/constants/app.constants';
import { auth } from '@/lib/auth';
import { emailValidation, passwordValidation } from '@calmpulse-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';
import * as z from 'zod';

const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
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
      { provider: 'google', callbackURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/dashboard` },
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
              form.setError('email', {
                message: 'Invalid email or password. Please try again.',
              });
              break;
            case auth.$ERROR_CODES.INVALID_EMAIL:
              form.setError('email', {
                message: 'Invalid email or password. Please try again.',
              });
              break;
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
    <div className="space-y-6 w-full">
      {/* Mobile Logo */}
      <div className="lg:hidden flex flex-col items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-foreground">{APP.name}</span>
        </div>
        <p className="text-muted-foreground text-sm text-center max-w-xs">{APP.description}</p>
        <Separator className="w-24 bg-border" />
      </div>

      <Card className="w-full">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
            Sign in
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className="w-4 h-4 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">Continue with Google</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center w-full text-xs uppercase text-muted-foreground">
            <div className="flex-1 border-t border-border" />
            <span className="mx-4 px-2">Or continue with email</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Email/Password Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@company.com"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          disabled={isPending}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isPending}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 flex items-center justify-center"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              {/* Forgot Password */}
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

              {/* Submit Button */}
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

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button type="button" variant="link" className="p-0 text-primary-foreground" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
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
    </div>
  );
}
