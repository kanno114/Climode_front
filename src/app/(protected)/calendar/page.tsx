import DailyLogCalendar from "./_components/DailyLogCalendar";
import { getDailyLogs } from "./actions";

export default async function CalendarPage() {
  const dailyLogs = await getDailyLogs();

  if (!dailyLogs) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="text-center text-muted-foreground py-12">
            <p>記録データを取得できませんでした。</p>
            <p className="text-sm mt-1">
              しばらく時間をおいてから再度お試しください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="space-y-4">
          {/* ヘッダーセクション */}
          <div>
            <h1 className="text-2xl font-bold">記録カレンダー</h1>
            <p className="text-muted-foreground text-sm mt-1">
              日々の記録をカレンダーで確認できます
            </p>
          </div>

          {/* 凡例 */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-lg">😊</span>
              <span>良い</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">😐</span>
              <span>普通</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">😕</span>
              <span>悪い</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base leading-none">•</span>
              <span>スコアなし</span>
            </div>
          </div>

          <DailyLogCalendar data={dailyLogs} />
        </div>
      </div>
    </div>
  );
}
