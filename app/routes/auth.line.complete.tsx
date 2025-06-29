import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { useUser } from '@clerk/remix';
import { Loader2 } from 'lucide-react';

export default function LineAuthComplete() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // Check authentication status
    if (isSignedIn) {
      // Success - redirect to home
      navigate('/?auth_success=line', { replace: true });
    } else {
      // If not signed in after Clerk loads, there was likely an error
      setIsLoading(false);
      setTimeout(() => {
        navigate('/?error=' + encodeURIComponent('LINE 登入失敗，請重試'), { replace: true });
      }, 1200);
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">完成 LINE 登入</h2>
          <p className="text-gray-600">正在設定您的帳戶...</p>
        </div>
      </div>
    );
  }

  // Error state (when not loading but also not signed in)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">登入失敗</h2>
        <p className="text-gray-600">LINE 登入過程中發生錯誤</p>
        <p className="text-sm text-gray-500 mt-2">正在重新導向...</p>
      </div>
    </div>
  );
}