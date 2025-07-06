import { Separator } from '@/components/ui/separator';
import { APP } from '@/constants/app.constants';
import { ForgetPasswordForm } from '../forms/ForgetPasswordForm';

export const ForgetPasswordView = () => {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Left Section - Reset Password Form */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            <ForgetPasswordForm />
          </div>
        </div>

        {/* Vertical Separator - Hidden on mobile */}
        <div className="hidden lg:flex items-center">
          <Separator orientation="vertical" className="h-full bg-border" />
        </div>

        {/* Right Section - Simple Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="flex flex-col justify-center items-center px-8 xl:px-12 py-16 text-center w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-semibold text-foreground">{APP.name}</span>
            </div>

            {/* Simple Description */}
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
              {APP.description}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Separator */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4">
        <Separator className="bg-border" />
      </div>
    </>
  );
};
