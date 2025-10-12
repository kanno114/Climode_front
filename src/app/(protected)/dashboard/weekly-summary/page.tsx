import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getWeeklyDailyLogs } from "./actions";
import { WeeklyScoreTrendChart } from "./_components/WeeklyScoreTrendChart";
import { WeatherHealthCorrelationChart } from "./_components/WeatherHealthCorrelationChart";
import { WeeklySummaryCards } from "./_components/WeeklySummaryCards";
import { WeeklyCalendarHeatmap } from "./_components/WeeklyCalendarHeatmap";

export default async function WeeklySummaryPage() {
  const weeklyData = await getWeeklyDailyLogs();

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              ダッシュボードに戻る
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                週間サマリー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">表示できるデータがありません。</p>
                <p className="text-sm text-gray-500 mt-2">
                  まずは日々の体調を記録してみましょう。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                週間サマリー
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                過去7日間の体調推移を確認できます
              </p>
            </div>
          </div>
        </div>

        {/* 週間サマリーカード */}
        <div className="mb-6">
          <WeeklySummaryCards data={weeklyData} />
        </div>

        {/* グラフセクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 体調スコア推移グラフ */}
          <WeeklyScoreTrendChart data={weeklyData} />

          {/* 天気と体調の相関グラフ */}
          <WeatherHealthCorrelationChart data={weeklyData} />
        </div>

        {/* カレンダーヒートマップ */}
        <WeeklyCalendarHeatmap data={weeklyData} />
      </div>
    </div>
  );
}
