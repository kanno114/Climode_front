import { Card, CardContent } from "@/components/ui/card";
import { TimeBasedHeader } from "./TimeBasedHeader";
import { BeforeInputContent } from "./BeforeInputContent";
import { AfterInputContent } from "./AfterInputContent";
import { ForecastTableAutoScroll } from "./ForecastTable";
import { getTodayDailyLog, getSuggestions, getForecastSeries } from "../actions";

export async function TodayArea() {
  // すべてのデータを並列で取得（Fetch-then-Render）
  const [todayDailyLog, suggestions, forecastSeries] = await Promise.all([
    getTodayDailyLog(),
    getSuggestions(),
    getForecastSeries(),
  ]);

  const normalizedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const hasDailyLog = todayDailyLog !== null;

  return (
    <Card className="py-4 gap-4">
      <TimeBasedHeader hasDailyLog={hasDailyLog} />
      <CardContent className="space-y-4">
        <ForecastTableAutoScroll forecast={forecastSeries ?? null} />
        {!todayDailyLog ? (
          <BeforeInputContent />
        ) : (
          <AfterInputContent
            dailyLog={todayDailyLog}
            suggestions={normalizedSuggestions}
          />
        )}
      </CardContent>
    </Card>
  );
}
