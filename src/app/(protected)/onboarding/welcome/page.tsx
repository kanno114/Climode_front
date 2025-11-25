"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkUserTriggersAction } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tutorial } from "./_components/Tutorial";

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(true);
  const [hasTriggers, setHasTriggers] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkUserTriggers = useCallback(async () => {
    try {
      const result = await checkUserTriggersAction();
      if (result.error === "Not authenticated") {
        router.push("/signin?message=login_required");
        return;
      }
      if (result.hasTriggers) {
        setHasTriggers(true);
        router.push("/dashboard");
      }
    } catch {
      // 失敗時は初回扱いでページ表示を続ける
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUserTriggers();
  }, [checkUserTriggers]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (hasTriggers) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {showTutorial ? (
          <Tutorial
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        ) : (
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
                  <Link href="/settings/triggers">設定を開始する</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">あとで</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
