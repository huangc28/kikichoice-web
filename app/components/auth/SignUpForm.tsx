import { useState } from 'react';
import { useSignUp } from '@clerk/remix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User } from 'lucide-react';

interface SignUpFormProps {
  onSuccess: () => void;
  onLoading: (loading: boolean) => void;
  disabled?: boolean;
}

export const SignUpForm = ({ onSuccess, onLoading, disabled }: SignUpFormProps) => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsSubmitting(true);
    onLoading(true);
    setError('');

    try {
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onSuccess();
      } else if (result.status === 'missing_requirements') {
        // Check if email verification is required
        if (result.missingFields.includes('email_address')) {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setPendingVerification(true);
        }
      }
    } catch (err: any) {
      console.error('Sign up error:', err);

      // Handle specific Clerk errors
      if (err.errors) {
        const errorMessage = err.errors[0]?.message || err.errors[0]?.longMessage;
        if (errorMessage.includes('email')) {
          setError('此電子郵件已被使用，請嘗試其他電子郵件或直接登入。');
        } else if (errorMessage.includes('password')) {
          setError('密碼格式不正確，請確保密碼至少包含8個字符。');
        } else {
          setError(errorMessage || '註冊失敗，請重試。');
        }
      } else {
        setError('註冊時發生錯誤，請稍後再試。');
      }
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsSubmitting(true);
    onLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onSuccess();
      }
    } catch (err: any) {
      console.error('Verification error:', err);

      if (err.errors) {
        const errorMessage = err.errors[0]?.message || err.errors[0]?.longMessage;
        if (errorMessage.includes('code') || errorMessage.includes('verification')) {
          setError('驗證碼錯誤，請重新輸入。');
        } else {
          setError(errorMessage || '驗證失敗，請重試。');
        }
      } else {
        setError('驗證時發生錯誤，請稍後再試。');
      }
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <form onSubmit={handleVerification} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium text-gray-900">驗證您的電子郵件</h3>
          <p className="text-sm text-gray-600">
            我們已發送驗證碼到 <strong>{email}</strong>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verification-code" className="text-sm font-medium text-gray-700">
            驗證碼
          </Label>
          <Input
            id="verification-code"
            type="text"
            placeholder="請輸入6位數驗證碼"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={disabled || isSubmitting}
            required
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={disabled || isSubmitting || !verificationCode}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              驗證中...
            </>
          ) : (
            '驗證並完成註冊'
          )}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setPendingVerification(false)}
            disabled={disabled || isSubmitting}
          >
            返回註冊表單
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-firstname" className="text-sm font-medium text-gray-700">
            名字
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="signup-firstname"
              type="text"
              placeholder="名字"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={disabled || isSubmitting}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-lastname" className="text-sm font-medium text-gray-700">
            姓氏
          </Label>
          <Input
            id="signup-lastname"
            type="text"
            placeholder="姓氏"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={disabled || isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
          電子郵件
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signup-email"
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
        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
          密碼
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="signup-password"
            type="password"
            placeholder="請輸入至少8個字符的密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={disabled || isSubmitting}
            required
            minLength={8}
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
            註冊中...
          </>
        ) : (
          '註冊'
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        註冊即表示您同意我們的
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700 underline-offset-2"
        >
          服務條款
        </Button>
        和
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700 underline-offset-2"
        >
          隱私政策
        </Button>
      </div>
    </form>
  );
};