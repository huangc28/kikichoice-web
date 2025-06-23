import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { LineAuthButton } from './LineAuthButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeToggle = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleAuthSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            {mode === 'signin' ? '登入' : '註冊'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* LINE Authentication */}
          <LineAuthButton
            onSuccess={handleAuthSuccess}
            onLoading={setIsLoading}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">或</span>
            </div>
          </div>

          {/* Email Authentication Forms */}
          {mode === 'signin' ? (
            <SignInForm
              onSuccess={handleAuthSuccess}
              onLoading={setIsLoading}
              disabled={isLoading}
            />
          ) : (
            <SignUpForm
              onSuccess={handleAuthSuccess}
              onLoading={setIsLoading}
              disabled={isLoading}
            />
          )}

          {/* Mode Toggle */}
          <div className="text-center text-sm text-gray-600">
            {mode === 'signin' ? (
              <>
                還沒有帳戶？{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700 underline-offset-2"
                  onClick={handleModeToggle}
                  disabled={isLoading}
                >
                  立即註冊
                </Button>
              </>
            ) : (
              <>
                已經有帳戶？{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700 underline-offset-2"
                  onClick={handleModeToggle}
                  disabled={isLoading}
                >
                  立即登入
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};