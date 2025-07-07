import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

interface PasswordFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isPending?: boolean;
}

export function PasswordField<T extends FieldValues>({
  form,
  name,
  label = 'Password',
  placeholder = 'Enter your password',
  isPending,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = form;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-muted-foreground">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
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
  );
}
