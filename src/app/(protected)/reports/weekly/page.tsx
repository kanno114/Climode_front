import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getWeeklyReport } from "./actions";
import { WeeklyReportInsight } from "./_components/WeeklyReportInsight";
import { WeeklySignalSummary } from "./_components/WeeklySignalSummary";
import { WeeklySignalChart } from "./_components/WeeklySignalChart";
import { WeeklyDailySummary } from "./_components/WeeklyDailySummary";
import { WeeklyFeedbackSummary } from "./_components/WeeklyFeedbackSummary";
import { WeeklyReportNavigation } from "./_components/WeeklyReportNavigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface WeeklyReportPageProps {
  searchParams: { start?: string };
}

export default async function WeeklyReportPage({
  searchParams,
}: WeeklyReportPageProps) {
  const weekStart = searchParams.start;
  const report = await getWeeklyReport(weekStart);

  if (!report) {
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
                週次レポート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">今週は記録が少ないようです。</p>
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

  const startDate = new Date(report.range.start);
  const endDate = new Date(report.range.end);
  const dateRange = `${format(startDate, "M/d", { locale: ja })}〜${format(endDate, "M/d", { locale: ja })}`;

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  週次レポート
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dateRange}
                </p>
              </div>
            </div>
            <WeeklyReportNavigation currentWeekStart={report.range.start} />
          </div>
        </div>

        {/* セクションA: 一言まとめ */}
        <div className="mb-6">
          <WeeklyReportInsight insight={report.insight} />
        </div>

        {/* セクションB: シグナル内訳 */}
        <div className="mb-6">
          <WeeklySignalSummary signals={report.signals} />
        </div>

        {/* セクションC: 日別推移 */}
        <div className="mb-6">
          <WeeklySignalChart signals={report.signals} />
        </div>

        {/* セクションD: 自己申告の平均 */}
        <div className="mb-6">
          <WeeklyDailySummary daily={report.daily} />
        </div>

        {/* セクションE: 提案の評価 */}
        <div className="mb-6">
          <WeeklyFeedbackSummary feedback={report.feedback} />
        </div>

        {/* フッター: 関連導線 */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              今日のシグナル
            </Link>
            <Link
              href="/evening"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              夜の振り返り
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

