import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { WeeklySummaryContent } from "./_components/WeeklySummaryContent";
import { WeeklyReportContent } from "./_components/WeeklyReportContent";
import { Button } from "@/components/ui/button";

export default async function WeeklyPage({
  searchParams,
}: {
  searchParams: { start?: string; tab?: string };
}) {
  const activeTab = searchParams.tab || "summary";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードに戻る
          </Link>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                週間レポート
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                体調推移とレポートを確認できます
              </p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-6 flex gap-2 border-b">
          <Link href="/dashboard/weekly?tab=summary">
            <Button
              variant={activeTab === "summary" ? "default" : "ghost"}
              className={`rounded-b-none ${
                activeTab === "summary" ? "border-b-2 border-blue-600" : ""
              }`}
            >
              週間サマリー
            </Button>
          </Link>
          <Link href="/dashboard/weekly?tab=report">
            <Button
              variant={activeTab === "report" ? "default" : "ghost"}
              className={`rounded-b-none ${
                activeTab === "report" ? "border-b-2 border-blue-600" : ""
              }`}
            >
              週次レポート
            </Button>
          </Link>
        </div>

        {/* コンテンツ */}
        {activeTab === "summary" ? (
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>週間サマリー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <WeeklySummaryContent />
          </Suspense>
        ) : (
          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>週次レポート</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <WeeklyReportContent weekStart={searchParams.start} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
