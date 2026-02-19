import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "メールアドレスの確認",
  description: "メールアドレスの確認を行います。",
};

interface ConfirmEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

async function confirmEmail(token: string) {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/email_confirmation`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const data = await res.json();
    return { ok: res.ok, message: data.message };
  } catch {
    return {
      ok: false,
      message: "通信エラーが発生しました。しばらく時間をおいて再度お試しください。",
    };
  }
}

export default async function ConfirmEmailPage({
  searchParams,
}: ConfirmEmailPageProps) {
  const params = await searchParams;
  const token = params.token;

  let result: { ok: boolean; message: string } | null = null;
  if (token) {
    result = await confirmEmail(token);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <Image
              src="/logo.svg"
              alt="Climode"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            メールアドレスの確認
          </CardTitle>
          <CardDescription className="text-center">
            {result?.ok
              ? "確認が完了しました"
              : "メールアドレスの確認を行っています"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token ? (
            <div className="text-center space-y-4">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="text-sm text-red-500">
                無効なリンクです。確認メールのリンクを再度ご確認ください。
              </p>
              <Link
                href="/signin"
                className="text-primary hover:underline text-sm"
              >
                ログインページへ
              </Link>
            </div>
          ) : result?.ok ? (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-sm text-muted-foreground">{result.message}</p>
              <Button asChild className="w-full cursor-pointer">
                <Link href="/signin">ログインページへ</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="text-sm text-muted-foreground">{result?.message}</p>
              <p className="text-sm text-muted-foreground">
                ログイン後、ダッシュボードから確認メールを再送信できます。
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full cursor-pointer"
              >
                <Link href="/signin">ログインページへ</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
