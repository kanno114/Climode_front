"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "認証の設定に問題があります。管理者にお問い合わせください。";
      case "AccessDenied":
        return "アクセスが拒否されました。";
      case "Verification":
        return "認証の検証に失敗しました。";
      case "Default":
      default:
        return "認証中にエラーが発生しました。";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            認証エラー
          </CardTitle>
          <CardDescription className="text-center">
            認証処理中に問題が発生しました
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ログインページに戻る
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>問題が解決しない場合は、</p>
            <p>サポートまでお問い合わせください。</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                認証エラー
              </CardTitle>
              <CardDescription className="text-center">
                読み込み中...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
