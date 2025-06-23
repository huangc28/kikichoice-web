import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/remix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, MessageCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
  redirectUrl?: string;
}

export function AuthModal({ isOpen, onClose, mode = 'signin', redirectUrl }: AuthModalProps) {
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        // Try to sign in with magic link
        const result = await signIn?.create({
          identifier: email,
          strategy: 'email_link',
          redirectUrl: redirectUrl || window.location.href,
        });

        if (result?.status === 'complete') {
          await setActive?.({ session: result.createdSessionId });
          onClose();
        } else {
          setEmailSent(true);
        }
      } else {
        // Sign up with magic link
        await signUp?.create({
          emailAddress: email,
          strategy: 'email_link',
          redirectUrl: redirectUrl || window.location.href,
        });
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signIn?.authenticateWithRedirect({
          strategy: 'oauth_line',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: redirectUrl || '/',
        });
      } else {
        await signUp?.authenticateWithRedirect({
          strategy: 'oauth_line',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: redirectUrl || '/',
        });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Mail className="h-5 w-5 text-green-500" />
              <span>檢查您的信箱</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              我們已經發送登入連結到您的信箱：
            </p>
            <p className="font-medium text-gray-900">{email}</p>
            <p className="text-sm text-gray-500">
              請檢查您的信箱並點擊連結完成登入
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                關閉
              </Button>
              <Button 
                onClick={() => setEmailSent(false)} 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                重新發送
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {mode === 'signin' ? '登入您的帳戶' : '建立新帳戶'}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {mode === 'signin' 
              ? '歡迎回來！請選擇登入方式' 
              : '加入 kikichoice 開始購物'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              onClick={handleLineAuth}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MessageCircle className="h-4 w-4 mr-2" />
              )}
              使用 LINE 登入
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">或</span>
            </div>
          </div>

          {/* Email Login */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              發送登入連結
            </Button>
          </form>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            點擊登入即表示您同意我們的
            <a href="/terms" className="text-orange-500 hover:underline ml-1">
              服務條款
            </a>
            和
            <a href="/privacy" className="text-orange-500 hover:underline ml-1">
              隱私政策
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}