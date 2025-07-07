'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { auth } from '@/lib/auth';
import { passwordValidation } from '@calmpulse-app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthCardLayout } from '../components/AuthCardLayout';
import { PasswordField } from '../components/PasswordField';
import { SwitchableFooter } from '../components/SwitchableFooter';
import { TermsFooter } from '../components/TermsFooter';

const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    startTransition(async () => {
      await auth.resetPassword(
        {
          newPassword: data.password,
          token,
        },
        {
          onSuccess: () => {
            toast.success('Your password has been reset. You can now sign in.');
            form.reset();
            router.push('/sign-in');
          },
          onError: (error) => {
            toast.error(error.error.message ?? 'Failed to reset password');
          },
        },
      );
    });
  };

  return (
    <AuthCardLayout title="Set a new password" description="Enter your new password below.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PasswordField
            form={form}
            name="password"
            label="New Password"
            placeholder="New password"
            isPending={isPending}
          />
          <PasswordField
            form={form}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            isPending={isPending}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </Form>
      <SwitchableFooter prompt="Back to" linkText="Sign in" linkHref="/sign-in" />
      <TermsFooter />
    </AuthCardLayout>
  );
}
