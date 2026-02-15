import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getWeeklyReport } from "../actions";
import { WeeklyReportNavigation } from "./WeeklyReportNavigation";
import { WeeklyOverview } from "./WeeklyOverview";
import { WeeklyRecordsChart } from "./WeeklyRecordsChart";
import { WeeklyRecordsTable } from "./WeeklyRecordsTable";
import { WeeklySuggestionsSection } from "./WeeklySuggestionsSection";
import { WeeklySuggestionsChart } from "./WeeklySuggestionsChart";
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

  const year = format(startDate, "yyyy", { locale: ja });
  const startDay = format(startDate, "M / d", { locale: ja });
  const endDay = format(endDate, "M / d", { locale: ja });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-0.5">
            {year}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white tracking-tight">
            {startDay}
            <span className="mx-1.5 text-gray-400 dark:text-gray-500 font-light">
              —
            </span>
            {endDay}
          </h2>
        </div>
        <WeeklyReportNavigation currentWeekStart={report.range.start} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="overview">サマリー</TabsTrigger>
          <TabsTrigger value="records">記録</TabsTrigger>
          <TabsTrigger value="suggestions">提案</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-0">
          <WeeklyOverview report={report} />
        </TabsContent>

        {/* Records */}
        <TabsContent value="records" className="mt-0">
          <div className="space-y-4 sm:space-y-6">
            <WeeklyRecordsChart
              daily={report.daily}
              feedback={report.feedback}
            />
            <WeeklyRecordsTable
              daily={report.daily}
              feedback={report.feedback}
            />
          </div>
        </TabsContent>

        {/* Suggestions */}
        <TabsContent value="suggestions" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <WeeklySuggestionsChart
                suggestions={report.suggestions}
                range={report.range}
              />
            </div>
            <div>
              <WeeklySuggestionsSection suggestions={report.suggestions} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
