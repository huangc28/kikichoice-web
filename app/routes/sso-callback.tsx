import { useEffect } from 'react';
import { useClerk } from '@clerk/remix';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  // This route handles the OAuth callback
  return null;
}

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback();
        // Redirect to the intended page or home
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect_url') || '/';
        navigate(redirectUrl);
      } catch (error) {
        console.error('SSO callback error:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [handleRedirectCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在完成登入...</p>
      </div>
    </div>
  );
}