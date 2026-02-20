import { GreetingSection } from "./GreetingSection";
import { BeforeInputContent } from "./BeforeInputContent";
import Suggestions from "./Suggestions";
import { WeatherSection } from "./WeatherSection";
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
    <div className="space-y-4">
      <GreetingSection
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

      {!todayDailyLog ? (
        <BeforeInputContent />
      ) : (
        <Suggestions suggestions={normalizedSuggestions} />
      )}

      <WeatherSection forecast={forecastSeries ?? null} />

      {hasDailyLog && (
        <ReflectionLinkFooter hasReflection={!!hasReflection} />
      )}
    </div>
  );
}
