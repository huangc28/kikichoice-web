import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const DELAY_MS = 500;

export const useAuthedToast = (authSuccess: string | null, authError: string | null) => {
  const { toast } = useToast();
  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        toast({
          title: "登入失敗",
          description: authError,
        });
      }, DELAY_MS);
    }

    if (authSuccess === "line") {
      setTimeout(() => {
        toast({
          title: "登入成功",
          description: "歡迎使用 LINE 登入！",
        });
      }, DELAY_MS);
    }
  }, [authSuccess, authError, toast]);
}


