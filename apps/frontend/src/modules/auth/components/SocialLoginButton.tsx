import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { FaGoogle } from 'react-icons/fa';

interface SocialLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function SocialLoginButton({ onClick, disabled, children }: SocialLoginButtonProps) {
  return (
    <Button type="button" variant="outline" disabled={disabled} onClick={onClick}>
      <FaGoogle className="w-4 h-4 mr-2 sm:mr-3" />
      {children}
    </Button>
  );
}
