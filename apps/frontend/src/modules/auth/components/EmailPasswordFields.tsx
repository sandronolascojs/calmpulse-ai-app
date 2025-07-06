import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface EmailPasswordFieldsProps<T extends FieldValues> {
  control: Control<T>;
  isPending?: boolean;
}

export function EmailPasswordFields<T extends FieldValues>({
  control,
  isPending,
}: EmailPasswordFieldsProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name={'email' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-muted-foreground">Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="name@company.com" disabled={isPending} />
            </FormControl>
            <FormMessage className="text-destructive text-sm" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'password' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-muted-foreground">Password</FormLabel>
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
    </>
  );
}
