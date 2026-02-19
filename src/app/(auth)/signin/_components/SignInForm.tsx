"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { signInAction } from "../actions";
import { signInSchema } from "@/lib/schemas/signin";
import { useFormToast } from "@/hooks/use-form-toast";

export function SignInForm() {
  const [lastResult, action, pending] = useActionState(signInAction, undefined);
  useFormToast(lastResult, { errorFallback: "ログインに失敗しました。" });

  const [form, fields] = useForm({
    id: "signin-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full cursor-pointer"
        aria-label="Googleアカウントでログイン"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Googleでログイン
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            または
          </span>
        </div>
      </div>

      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        noValidate
        className="space-y-4"
      >
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

        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              name={fields.password.name}
              key={fields.password.key}
              placeholder="パスワードを入力"
              className="pl-10 pr-10"
              disabled={pending}
            />
          </div>
          {fields.password.errors?.map((e) => (
            <p key={e} className="text-sm text-red-500" role="alert">
              {e}
            </p>
          ))}
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:underline"
          >
            パスワードをお忘れですか？
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ログイン中...
            </>
          ) : (
            "ログイン"
          )}
        </Button>
      </form>
    </>
  );
}
