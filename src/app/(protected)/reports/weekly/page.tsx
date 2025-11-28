import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { WeeklyReportContent } from "./_components/WeeklyReportContent";

export default async function WeeklyReportPage({
  searchParams,
}: {
  searchParams: { start?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                週間レポート
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                体調推移とレポートを確認できます
              </p>
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>週間レポート</CardTitle>
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
      </div>
    </div>
  );
}
