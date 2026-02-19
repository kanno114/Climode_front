"use client";

import { useState, useCallback } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import { resetPasswordAction } from "../actions";
import { resetPasswordSchema } from "@/lib/schemas/reset-password";
import { useFormToast } from "@/hooks/use-form-toast";
import Link from "next/link";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [completed, setCompleted] = useState(false);
  const boundAction = useCallback(
    (prev: unknown, formData: FormData) =>
      resetPasswordAction(token, prev, formData),
    [token]
  );
  const [lastResult, action, pending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const result = await boundAction(prev, formData);
      if (result?.status === "success") {
        setCompleted(true);
      }
      return result;
    },
    undefined
  );
  useFormToast(lastResult, {
    errorFallback: "パスワードの更新に失敗しました。",
  });

  const [form, fields] = useForm({
    id: "reset-password-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  if (completed) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <p className="text-sm text-muted-foreground">
          パスワードが正常に更新されました。
          <br />
          新しいパスワードでログインしてください。
        </p>
        <Button asChild className="w-full cursor-pointer">
          <Link href="/signin">ログインページへ</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate
      className="space-y-4"
    >
      <p className="text-sm text-muted-foreground">
        新しいパスワードを入力してください。
      </p>

      <div className="space-y-2">
        <Label htmlFor="password">新しいパスワード</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            name={fields.password.name}
            key={fields.password.key}
            placeholder="8文字以上で入力"
            className="pl-10"
            disabled={pending}
          />
        </div>
        {fields.password.errors?.map((e) => (
          <p key={e} className="text-sm text-red-500" role="alert">
            {e}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">パスワード確認</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            name={fields.confirmPassword.name}
            key={fields.confirmPassword.key}
            placeholder="パスワードを再入力"
            className="pl-10"
            disabled={pending}
          />
        </div>
        {fields.confirmPassword.errors?.map((e) => (
          <p key={e} className="text-sm text-red-500" role="alert">
            {e}
          </p>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            更新中...
          </>
        ) : (
          "パスワードを更新"
        )}
      </Button>
    </form>
  );
}
