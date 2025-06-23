import { useState } from 'react';
import { useSignIn } from '@clerk/remix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';

interface SignInFormProps {
  onSuccess: () => void;
  onLoading: (loading: boolean) => void;
  disabled?: boolean;
}

export const SignInForm = ({ onSuccess, onLoading, disabled }: SignInFormProps) => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsSubmitting(true);
    onLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onSuccess();
      } else {
        // Handle cases where additional verification is needed
        setError('登入需要額外驗證，請檢查您的電子郵件。');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);

      // Handle specific Clerk errors
      if (err.errors) {
        const errorMessage = err.errors[0]?.message || err.errors[0]?.longMessage;
        if (errorMessage.includes('password')) {
          setError('密碼錯誤，請重新輸入。');
        } else if (errorMessage.includes('identifier')) {
          setError('找不到此電子郵件帳戶，請確認您的電子郵件地址或註冊新帳戶。');
        } else {
          setError(errorMessage || '登入失敗，請重試。');
        }
      } else {
        setError('登入時發生錯誤，請稍後再試。');
      }
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
          電子郵件
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signin-email"
            type="email"
            placeholder="請輸入您的電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled || isSubmitting}
            required
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
          密碼
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signin-password"
            type="password"
            placeholder="請輸入您的密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={disabled || isSubmitting}
            required
            className="pl-10"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={disabled || isSubmitting || !email || !password}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            登入中...
          </>
        ) : (
          '登入'
        )}
      </Button>

      {/* Forgot Password Link - Can be implemented later */}
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-sm text-gray-500 hover:text-gray-700"
          disabled={disabled || isSubmitting}
        >
          忘記密碼？
        </Button>
      </div>
    </form>
  );
};