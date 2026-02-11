import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getWeeklyReport } from "../actions";
import { WeeklyReportNavigation } from "./WeeklyReportNavigation";
import { WeeklyMorningStatistics } from "./WeeklyMorningStatistics";
import { WeeklyMorningChart } from "./WeeklyMorningChart";
import { WeeklyEveningStatistics } from "./WeeklyEveningStatistics";
import { WeeklyEveningChart } from "./WeeklyEveningChart";
import { WeeklySuggestionsSection } from "./WeeklySuggestionsSection";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

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
  const dateRange = `${format(startDate, "M/d", { locale: ja })}〜${format(
    endDate,
    "M/d",
    { locale: ja }
  )}`;

  return (
    <>
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              {dateRange}
            </h2>
          </div>
        </div>
        <WeeklyReportNavigation currentWeekStart={report.range.start} />
      </div>

      {/* タブ */}
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="suggestions">提案</TabsTrigger>
          <TabsTrigger value="morning">朝の自己申告</TabsTrigger>
          <TabsTrigger value="evening">夜の振り返り</TabsTrigger>
        </TabsList>

        {/* 朝の自己申告セクション */}
        <TabsContent value="morning" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {report.statistics && (
              <div>
                <WeeklyMorningStatistics statistics={report.statistics} />
              </div>
            )}
            <div>
              <WeeklyMorningChart daily={report.daily} />
            </div>
          </div>
        </TabsContent>

        {/* 夜の振り返りセクション */}
        <TabsContent value="evening" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <WeeklyEveningStatistics feedback={report.feedback} />
            </div>
            <div>
              <WeeklyEveningChart feedback={report.feedback} />
            </div>
          </div>
        </TabsContent>

        {/* 提案セクション */}
        <TabsContent value="suggestions" className="mt-0">
          <WeeklySuggestionsSection suggestions={report.suggestions} />
        </TabsContent>
      </Tabs>
    </>
  );
}
