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
import { SignUpForm } from "./_components/SignUpForm";

export const metadata: Metadata = {
  title: "新規登録",
  description:
    "Climodeのアカウントを作成して、体調管理を始めましょう。Googleアカウントでも登録できます。",
};

export default async function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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

          <div className="text-center text-xs space-x-3">
            <Link
              href="/terms-of-service"
              className="text-muted-foreground hover:underline"
            >
              利用規約
            </Link>
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:underline"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:underline"
            >
              About
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
