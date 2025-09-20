import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./_components/SignInForm";
import { LoginRequiredToast } from "./_components/LoginRequiredToast";

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
          {params.message === "login_required" && <LoginRequiredToast />}
          <SignInForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              アカウントをお持ちでない方は
            </span>{" "}
            <Link href="/signup" className="text-primary hover:underline">
              新規登録
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
