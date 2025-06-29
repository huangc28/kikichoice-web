import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSignIn } from '@clerk/remix';

interface LineAuthButtonProps {
  onSuccess: () => void;
  onLoading: (loading: boolean) => void;
  disabled?: boolean;
}

const isInLineApp = () => {
  return /Line/i.test(navigator.userAgent);
};

export const LineAuthButton = ({ onSuccess, onLoading, disabled }: LineAuthButtonProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { signIn, isLoaded } = useSignIn();
  const handleLineAuth = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    onLoading(true);
    setError('');

    signIn.authenticateWithRedirect({
      strategy: 'oauth_line',
      redirectUrl: '/auth/line/callback',
      redirectUrlComplete: '/auth/line/complete',
    }).catch((err) => {
      console.error('LINE authentication error:', err);
      setError('LINE 登入時發生錯誤，請稍後再試或使用其他方式登入。');
      setIsLoading(false);
      onLoading(false);
    });
  };

  const buttonText = isMobile ?
    (isInLineApp() ? '使用 LINE 登入' : 'LINE 登入') :
    '使用 LINE 登入';

  return (
    <div className="space-y-3">
      {error && (
        <Alert>
          <AlertDescription className="text-amber-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-2 border-[#00B900] hover:bg-[#00B900]/5 hover:border-[#00B900] text-[#00B900] font-medium py-3 transition-colors"
        onClick={handleLineAuth}
        disabled={disabled || isLoading}
      >
        <div className="mr-3 flex items-center">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#00B900]"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.4 12.8c-.1.3-.6.5-.9.5-.2 0-.4-.1-.7-.2-1.4-.6-2.4-1.5-3.2-2.8-.4-.6-.6-1.2-.6-1.8 0-.3.1-.5.3-.7.2-.2.4-.3.6-.3.2 0 .4.1.5.3.4.6.8 1.1 1.3 1.5.2.2.5.3.7.3.3 0 .5-.1.7-.3.2-.2.3-.5.3-.8 0-.2-.1-.4-.2-.5-.3-.4-.7-.7-1.1-.9-.2-.1-.3-.2-.3-.4 0-.2.1-.4.3-.5.4-.2.8-.3 1.2-.3.5 0 .9.2 1.2.5.3.3.5.7.5 1.1 0 .2 0 .4-.1.6z"/>
            </svg>
          )}
        </div>
        {isLoading ? '登入中...' : buttonText}
      </Button>

      {isMobile && !isInLineApp() && (
        <div className="text-xs text-gray-500 text-center">
          如已安裝 LINE 應用程式，將自動開啟進行驗證
        </div>
      )}
    </div>
  );
};

// Alternative implementation with proper LINE logo (for future use)
export const LineAuthButtonWithLogo = ({ disabled }: LineAuthButtonProps) => {
  const [error, setError] = useState('');

  return (
    <div className="space-y-3">
      {error && (
        <Alert>
          <AlertDescription className="text-amber-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-2 border-[#00B900] hover:bg-[#00B900]/5 hover:border-[#00B900] text-[#00B900] font-medium py-3 transition-colors"
        onClick={() => setError('LINE 登入功能正在開發中，請使用電子郵件登入。')}
        disabled={disabled}
      >
        <div className="mr-3 flex items-center">
          {/* Official LINE colors: #00B900 (main green) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#00B900]"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.4 12.8c-.1.3-.6.5-.9.5-.2 0-.4-.1-.7-.2-1.4-.6-2.4-1.5-3.2-2.8-.4-.6-.6-1.2-.6-1.8 0-.3.1-.5.3-.7.2-.2.4-.3.6-.3.2 0 .4.1.5.3.4.6.8 1.1 1.3 1.5.2.2.5.3.7.3.3 0 .5-.1.7-.3.2-.2.3-.5.3-.8 0-.2-.1-.4-.2-.5-.3-.4-.7-.7-1.1-.9-.2-.1-.3-.2-.3-.4 0-.2.1-.4.3-.5.4-.2.8-.3 1.2-.3.5 0 .9.2 1.2.5.3.3.5.7.5 1.1 0 .2 0 .4-.1.6z"/>
          </svg>
        </div>
        使用 LINE 登入
      </Button>
    </div>
  );
};