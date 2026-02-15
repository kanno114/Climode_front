import { EveningReflectionForm } from "./_components/EveningReflectionForm";
import { getTodaySuggestions, getTodayDailyLog } from "./actions";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default async function EveningPage() {
  const today = new Date();

  const [suggestions, dailyLog] = await Promise.all([
    getTodaySuggestions(),
    getTodayDailyLog(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">今日1日を振り返ってみましょう</h1>
            <p className="text-lg text-muted-foreground">
              {format(today, "yyyy年MM月dd日", { locale: ja })}
            </p>
          </div>

          {/* フォーム */}
          <EveningReflectionForm
            initialSuggestions={suggestions ?? []}
            initialDailyLog={dailyLog}
          />
        </div>
      </div>
    </div>
  );
}
