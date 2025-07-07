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
import { emailValidation } from '@calmpulse-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthCardLayout } from '../components/AuthCardLayout';
import { SwitchableFooter } from '../components/SwitchableFooter';
import { TermsFooter } from '../components/TermsFooter';

const forgetPasswordSchema = z.object({
  email: emailValidation,
});

type ResetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export function ForgetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    startTransition(async () => {
      await auth.forgetPassword({
        email: data.email,
        redirectTo: `${env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
      });
      toast.success('If an account exists for this email, a reset link has been sent.');
      form.reset();
      router.push('/sign-in');
    });
  };

  return (
    <AuthCardLayout
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">Email</FormLabel>
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      </Form>
      <SwitchableFooter prompt="Remembered your password?" linkText="Sign in" linkHref="/sign-in" />
      <TermsFooter />
    </AuthCardLayout>
  );
}
