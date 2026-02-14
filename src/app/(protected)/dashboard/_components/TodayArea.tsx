import { Card, CardContent } from "@/components/ui/card";
import { TimeBasedHeader } from "./TimeBasedHeader";
import { BeforeInputContent } from "./BeforeInputContent";
import { AfterInputContent } from "./AfterInputContent";
import { ForecastTableAutoScroll } from "./ForecastTable";
import { ReflectionLinkFooter } from "./ReflectionLinkFooter";
import { EveningReflectionDisplay } from "./EveningReflectionDisplay";
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
  const hasReflection =
    hasDailyLog &&
    (!!todayDailyLog.note ||
      (todayDailyLog.suggestion_feedbacks?.length ?? 0) > 0);

  return (
    <Card className="py-4">
      <TimeBasedHeader
        hasDailyLog={hasDailyLog}
        hasReflection={!!hasReflection}
        reflectionSlot={
          hasReflection && todayDailyLog ? (
            <EveningReflectionDisplay
              note={todayDailyLog.note}
              suggestion_feedbacks={todayDailyLog.suggestion_feedbacks}
            />
          ) : undefined
        }
      />
      <CardContent className="space-y-6">
        {!todayDailyLog ? (
          <BeforeInputContent />
        ) : (
          <AfterInputContent
            dailyLog={todayDailyLog}
            suggestions={normalizedSuggestions}
          />
        )}
        <ForecastTableAutoScroll forecast={forecastSeries ?? null} />
        {hasDailyLog && (
          <ReflectionLinkFooter hasReflection={!!hasReflection} />
        )}
      </CardContent>
    </Card>
  );
}
