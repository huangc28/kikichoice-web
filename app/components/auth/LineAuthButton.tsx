import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getEnv } from '@/lib/env.client.js';
import { useIsMobile } from '@/hooks/use-mobile';

interface LineAuthButtonProps {
  onSuccess: () => void;
  onLoading: (loading: boolean) => void;
  disabled?: boolean;
}

// Utility functions for mobile detection and LINE app detection
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isInLineApp = () => {
  return /Line/i.test(navigator.userAgent);
};

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Function to attempt to open LINE app, with fallback to web auth
const attemptLineAppAuth = (authUrl: string) => {
  const isMobile = isMobileDevice();
  const inLineApp = isInLineApp();

  // If already in LINE app, proceed with normal web auth
  if (inLineApp) {
    window.location.href = authUrl;
    return;
  }

  // If on mobile, try to open LINE app first
  if (isMobile) {
    let appOpened = false;

    const visibilityChangeHandler = () => {
      if (document.hidden) {
        appOpened = true;
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
      }
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler);

    // Set a fallback timer to use web auth if LINE app doesn't open
    const fallbackTimer = setTimeout(() => {
      if (!appOpened) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
        window.location.href = authUrl;
      }
    }, 2500);

    if (isIOS()) {
      // For iOS, try LINE URL scheme first, then fallback
      const lineAppScheme = `line://oauth/authorize?${new URL(authUrl).searchParams.toString()}`;

      // Try to open LINE app with URL scheme
      window.location.href = lineAppScheme;

      // If that fails, the fallback timer will redirect to web auth
    } else if (isAndroid()) {
      // For Android, try intent URL for better app detection
      const searchParams = new URL(authUrl).searchParams.toString();
      const intentUrl = `intent://oauth/authorize?${searchParams}#Intent;scheme=line;package=jp.naver.line.android;S.browser_fallback_url=${encodeURIComponent(authUrl)};end`;

      try {
        window.location.href = intentUrl;
      } catch (e) {
        clearTimeout(fallbackTimer);
        window.location.href = authUrl;
      }
    } else {
      // Other mobile browsers: fallback to web auth
      clearTimeout(fallbackTimer);
      window.location.href = authUrl;
    }

    return;
  }

  // Desktop: use normal web auth
  window.location.href = authUrl;
};

export const LineAuthButton = ({ onSuccess, onLoading, disabled }: LineAuthButtonProps) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleLineAuth = async () => {
    setIsLoading(true);
    onLoading(true);
    setError('');

    try {
      const env = getEnv();

      if (!env.LINE_ID) {
        throw new Error('LINE_ID not configured');
      }

      // Generate state for CSRF protection
      const state = crypto.randomUUID();
      sessionStorage.setItem('line_oauth_state', state);

      // Build LINE OAuth URL with mobile-optimized parameters
      const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
      lineAuthUrl.searchParams.set('response_type', 'code');
      lineAuthUrl.searchParams.set('client_id', env.LINE_ID);
      lineAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/line/callback`);
      lineAuthUrl.searchParams.set('state', state);
      lineAuthUrl.searchParams.set('scope', 'profile openid email');

      // Use mobile app auth on mobile, web auth on desktop
      attemptLineAppAuth(lineAuthUrl.toString());

    } catch (err: any) {
      console.error('LINE authentication error:', err);
      setError('LINE 登入時發生錯誤，請稍後再試或使用其他方式登入。');
      setIsLoading(false);
      onLoading(false);
    }
  };

  const buttonText = isMobile ?
    (isInLineApp() ? '使用 LINE 登入' : '開啟 LINE 應用程式登入') :
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
          點擊將嘗試開啟 LINE 應用程式進行驗證
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