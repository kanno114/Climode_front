"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, X } from "lucide-react";
import { resendConfirmationEmail } from "@/app/(auth)/auth-actions";

export function EmailConfirmationBanner() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (dismissed) return null;

  async function handleResend() {
    setSending(true);
    setError(null);
    try {
      const result = await resendConfirmationEmail();
      if (result.success) {
        setSent(true);
      } else {
        setError(result.error || "送信に失敗しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSending(false);
    }
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">
        メールアドレスの確認が完了していません
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        {sent ? (
          <p>確認メールを送信しました。メールをご確認ください。</p>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p>登録メールアドレスに届いた確認メールのリンクをクリックしてください。</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={sending}
                className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900 cursor-pointer"
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    送信中...
                  </>
                ) : (
                  "確認メールを再送信"
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDismissed(true)}
                className="shrink-0 text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900 cursor-pointer"
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </AlertDescription>
    </Alert>
  );
}
