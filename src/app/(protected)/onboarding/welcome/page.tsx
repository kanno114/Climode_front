import { auth } from "@/auth";
import { fetchUserTriggers } from "@/lib/api/triggers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function OnboardingWelcomePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?message=login_required");
  }

  try {
    const userTriggers = await fetchUserTriggers(session.user.id);
    if (Array.isArray(userTriggers) && userTriggers.length > 0) {
      redirect("/dashboard");
    }
  } catch {
    // 失敗時は初回扱いでページ表示を続ける
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">ようこそ！</CardTitle>
            <CardDescription>
              はじめに、あなたの体調に影響する「トリガー」を設定しましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground">
              設定すると通知や提案が最適化されます。後からいつでも変更できます。
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/setup/triggers">設定を開始する</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">あとで</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
