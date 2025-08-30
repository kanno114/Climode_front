import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "./_components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Climode
          </CardTitle>
          <CardDescription className="text-center">
            新規アカウントを作成
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              既にアカウントをお持ちの方は
            </span>{" "}
            <Link href="/signin" className="text-primary hover:underline">
              ログイン
            </Link>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <p className="text-muted-foreground text-center">
              テスト用ダミーアカウント
            </p>
            <div className="rounded-md border p-3 space-y-2 bg-muted/40">
              <div>
                <span className="font-medium">名前:</span>
                <div className="mt-1">
                  <code className="text-xs bg-background px-2 py-1 rounded select-all cursor-text block">
                    テストユーザー
                  </code>
                </div>
              </div>
              <div>
                <span className="font-medium">メール:</span>
                <div className="mt-1">
                  <code className="text-xs bg-background px-2 py-1 rounded select-all cursor-text block">
                    testuser1@example.com
                  </code>
                </div>
              </div>
              <div>
                <span className="font-medium">パスワード:</span>
                <div className="mt-1">
                  <code className="text-xs bg-background px-2 py-1 rounded select-all cursor-text block">
                    testuser123
                  </code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
