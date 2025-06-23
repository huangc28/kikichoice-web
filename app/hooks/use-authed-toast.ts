import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const DELAY_MS = 500;

export const useAuthedToast = (authSuccess: string | null, authError: string | null) => {
  const { toast } = useToast();

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        toast({
          variant: "error" as const,
          title: "❌ 登入失敗",
          description: authError,
          duration: 5000,
        });
      }, DELAY_MS);
    }

    if (authSuccess === "line") {
      setTimeout(() => {
        toast({
          variant: "success" as const,
          title: "✅ 登入成功",
          description: "歡迎使用 LINE 登入！",
          duration: 4000,
        });
      }, DELAY_MS);
    }
  }, [authSuccess, authError, toast]);
}


