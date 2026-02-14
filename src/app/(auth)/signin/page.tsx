import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./_components/SignInForm";
import { ToastMessage } from "./_components/ToastMessage";

interface SignInPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Climode
          </CardTitle>
          <CardDescription className="text-center">
            体調管理アプリにログイン
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {params.message === "login_required" && (
            <ToastMessage
              message="ログインが必要です"
              description="このページにアクセスするには、アカウントにログインしてください。"
              duration={5000}
            />
          )}
          {params.message === "session_expired" && (
            <ToastMessage
              message="セッションの有効期限が切れました"
              description="再度ログインしてください。"
              duration={5000}
            />
          )}
          {params.message === "token_refresh_failed" && (
            <ToastMessage
              message="認証の更新に失敗しました"
              description="再度ログインしてください。"
              duration={5000}
            />
          )}
          {params.message === "invalid_token" && (
            <ToastMessage
              message="無効な認証情報です"
              description="再度ログインしてください。"
              duration={5000}
            />
          )}
          <SignInForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              アカウントをお持ちでない方は
            </span>{" "}
            <Link href="/signup" className="text-primary hover:underline">
              新規登録
            </Link>
          </div>

          <div className="text-center text-xs">
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:underline"
            >
              プライバシーポリシー
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
