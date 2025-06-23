import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from '@remix-run/react';
import { useSignIn } from '@clerk/remix';
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { createClerkClient } from "@clerk/remix/api.server";
import { getClientEnv } from "~/lib/env.server";
import { Loader2 } from 'lucide-react';

// Server-side loader to get session from HTTP-only cookie
export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = new Map();

  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies.set(name, value);
    });
  }

  const sessionId = cookies.get("__clerk_line_session");
  if (!sessionId) {
    return json({
      error: "驗證資訊缺失",
      sessionId: null
    });
  }

  try {
    // Verify session with Clerk
    const env = getClientEnv();
    const clerkClient = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY!,
    });

    const session = await clerkClient.sessions.getSession(sessionId);
    if (!session || session.status !== 'active') {
      return json({
        error: "無效的登入狀態",
        sessionId: null
      });
    }

    // Clear the temporary cookie and return session info
    return new Response(JSON.stringify({
      sessionId: session.id,
      error: null
    }), {
      headers: {
        "Content-Type": "application/json",
        // Clear the temporary cookie
        "Set-Cookie": "__clerk_line_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
      }
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return json({
      error: "登入驗證失敗",
      sessionId: null
    });
  }
}

export default function LineAuthComplete() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeAuth = async () => {
      try {
        // Wait for Clerk to be loaded
        if (!isLoaded) {
          return; // useEffect will re-run when isLoaded changes
        }

        // Check if we have session data from the loader
        if (loaderData.error || !loaderData.sessionId) {
          throw new Error(loaderData.error || 'Session not found');
        }

        // Use the same pattern as SignInForm
        await setActive({ session: loaderData.sessionId });

        // Redirect to home with success indicator
        navigate('/?auth_success=line', { replace: true });

      } catch (err) {
        console.error('LINE auth completion error:', err);
        const errorMessage = err instanceof Error ? err.message : 'LINE 登入完成失敗';
        setError(errorMessage);
        setIsLoading(false);

        // Redirect to home with error after a short delay
        setTimeout(() => {
          navigate('/?error=' + encodeURIComponent(errorMessage), { replace: true });
        }, 2000);
      }
    };

    completeAuth().then(() => {});
  }, [loaderData, navigate, setActive, isLoaded]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">登入失敗</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">正在重新導向...</p>
        </div>
      </div>
    );
  }

  return null;
}