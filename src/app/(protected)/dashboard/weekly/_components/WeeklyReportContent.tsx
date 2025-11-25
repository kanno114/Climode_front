import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeeklyReport } from "../../../reports/weekly/actions";
import { WeeklyReportInsight } from "../../../reports/weekly/_components/WeeklyReportInsight";
import { WeeklySignalSummary } from "../../../reports/weekly/_components/WeeklySignalSummary";
import { WeeklySignalChart } from "../../../reports/weekly/_components/WeeklySignalChart";
import { WeeklyDailySummary } from "../../../reports/weekly/_components/WeeklyDailySummary";
import { WeeklyFeedbackSummary } from "../../../reports/weekly/_components/WeeklyFeedbackSummary";
import { WeeklyReportNavigation } from "../../../reports/weekly/_components/WeeklyReportNavigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

export async function WeeklyReportContent({
  weekStart,
}: {
  weekStart?: string;
}) {
  const report = await getWeeklyReport(weekStart);

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>週次レポート</CardTitle>
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
    );
  }

  const startDate = new Date(report.range.start);
  const endDate = new Date(report.range.end);
  const dateRange = `${format(startDate, "M/d", { locale: ja })}〜${format(endDate, "M/d", { locale: ja })}`;

  return (
    <>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              週次レポート
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dateRange}
            </p>
          </div>
        </div>
        <WeeklyReportNavigation currentWeekStart={report.range.start} />
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
    </>
  );
}

