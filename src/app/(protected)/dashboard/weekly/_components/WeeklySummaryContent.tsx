import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeeklyDailyLogs } from "../../weekly-summary/actions";
import { WeeklyScoreTrendChart } from "../../weekly-summary/_components/WeeklyScoreTrendChart";
import { WeatherHealthCorrelationChart } from "../../weekly-summary/_components/WeatherHealthCorrelationChart";
import { WeeklySummaryCards } from "../../weekly-summary/_components/WeeklySummaryCards";
import { WeeklyCalendarHeatmap } from "../../weekly-summary/_components/WeeklyCalendarHeatmap";

export async function WeeklySummaryContent() {
  const weeklyData = await getWeeklyDailyLogs();

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>週間サマリー</CardTitle>
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
    );
  }

  return (
    <>
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
    </>
  );
}

