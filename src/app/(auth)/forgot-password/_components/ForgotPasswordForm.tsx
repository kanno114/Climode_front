"use client";

import { useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { forgotPasswordAction } from "../actions";
import { forgotPasswordSchema } from "@/lib/schemas/forgot-password";
import { useFormToast } from "@/hooks/use-form-toast";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [lastResult, action, pending] = useActionState(
    async (prev: unknown, formData: FormData) => {
      const result = await forgotPasswordAction(prev, formData);
      if (result?.status === "success") {
        setSent(true);
      }
      return result;
    },
    undefined
  );
  useFormToast(lastResult, {
    errorFallback: "送信に失敗しました。",
  });

  const [form, fields] = useForm({
    id: "forgot-password-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: forgotPasswordSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <p className="text-sm text-muted-foreground">
          パスワードリセット用のメールを送信しました。
          <br />
          メールに記載されたリンクからパスワードを再設定してください。
        </p>
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
        登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
      </p>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            name={fields.email.name}
            key={fields.email.key}
            placeholder="example@email.com"
            className="pl-10"
            disabled={pending}
          />
        </div>
        {fields.email.errors?.map((e) => (
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
            送信中...
          </>
        ) : (
          "リセットメールを送信"
        )}
      </Button>
    </form>
  );
}
