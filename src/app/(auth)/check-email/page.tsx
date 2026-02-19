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
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "確認メールを送信しました",
  description: "メールアドレスの確認をお願いします。",
};

export default function CheckEmailPage() {
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
            確認メールを送信しました
          </CardTitle>
          <CardDescription className="text-center">
            登録ありがとうございます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <Mail className="mx-auto h-12 w-12 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              ご登録いただいたメールアドレスに確認メールを送信しました。
              <br />
              メール内のリンクをクリックして、メールアドレスの確認を完了してください。
            </p>
            <p className="text-xs text-muted-foreground">
              メールが届かない場合は、迷惑メールフォルダもご確認ください。
            </p>
          </div>

          <Button asChild className="w-full cursor-pointer">
            <Link href="/dashboard">ダッシュボードへ進む</Link>
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            メールアドレスの確認はあとからでも行えます。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
