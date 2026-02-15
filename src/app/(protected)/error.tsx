"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">エラーが発生しました</h2>
        <p className="text-muted-foreground">
          データの読み込みに失敗しました。もう一度お試しください。
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset}>再試行</Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">ダッシュボードへ戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
