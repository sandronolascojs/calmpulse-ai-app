import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FieldValues, Path, type UseFormReturn } from 'react-hook-form';
import { PasswordField } from './PasswordField';

interface EmailPasswordFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  isPending?: boolean;
}

export function EmailPasswordFields<T extends FieldValues>({
  form,
  isPending,
}: EmailPasswordFieldsProps<T>) {
  const { control } = form;

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
      <PasswordField
        form={form}
        name={'password' as Path<T>}
        label="Password"
        placeholder="Password"
        isPending={isPending}
      />
    </>
  );
}
