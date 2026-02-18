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
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "パスワードの再設定",
  description: "新しいパスワードを設定してください。",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token;

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
            パスワードの再設定
          </CardTitle>
          <CardDescription className="text-center">
            新しいパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-red-500">
                無効なリンクです。パスワードリセットを再度申請してください。
              </p>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline text-sm"
              >
                パスワードリセットを申請する
              </Link>
            </div>
          )}

          <div className="text-center text-sm">
            <Link href="/signin" className="text-primary hover:underline">
              ログインに戻る
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
