"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type ConformResult = {
  status?: string;
  error?: {
    message?: string;
    formErrors?: string[];
  };
} | null | undefined;

/**
 * Conform の lastResult をもとにエラー/成功の toast を表示するフック
 *
 * @param lastResult - useActionState から返る Conform の SubmissionResult
 * @param options - エラー・成功時のフォールバックメッセージ
 */
export function useFormToast(
  lastResult: ConformResult,
  options?: {
    errorFallback?: string;
    successMessage?: string;
  },
) {
  useEffect(() => {
    if (!lastResult) return;

    if (lastResult.status === "error") {
      const message =
        lastResult.error?.message ||
        lastResult.error?.formErrors?.[0] ||
        options?.errorFallback ||
        "エラーが発生しました";
      toast.error(message);
    } else if (lastResult.status === "success" && options?.successMessage) {
      toast.success(options.successMessage);
    }
  }, [lastResult, options?.errorFallback, options?.successMessage]);
}
