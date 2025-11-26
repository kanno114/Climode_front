import { Card, CardContent } from "@/components/ui/card";
import { TimeBasedHeader } from "./TimeBasedHeader";
import { BeforeInputContent } from "./BeforeInputContent";
import { AfterInputContent } from "./AfterInputContent";
import { getTodayDailyLog, getSuggestions, getTodaySignals } from "../actions";

export async function TodayArea() {
  // すべてのデータを並列で取得（Fetch-then-Render）
  const [todayDailyLog, suggestions, allSignals] = await Promise.all([
    getTodayDailyLog(),
    getSuggestions(),
    getTodaySignals(), // カテゴリー指定なしで全件取得
  ]);

  const normalizedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const hasDailyLog = todayDailyLog !== null;

  // フロントエンドでカテゴリーごとに分ける
  const normalizedAllSignals = Array.isArray(allSignals) ? allSignals : [];
  const envSignals = normalizedAllSignals.filter((s) => s.category === "env");
  const bodySignals = normalizedAllSignals.filter((s) => s.category === "body");

  return (
    <Card>
      <TimeBasedHeader hasDailyLog={hasDailyLog} />
      <CardContent className="space-y-6">
        {!todayDailyLog ? (
          <BeforeInputContent envSignals={envSignals} />
        ) : (
          <AfterInputContent
            dailyLog={todayDailyLog}
            suggestions={normalizedSuggestions}
            bodySignals={bodySignals}
            envSignals={envSignals}
          />
        )}
      </CardContent>
    </Card>
  );
}
