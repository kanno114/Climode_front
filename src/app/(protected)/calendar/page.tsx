import DailyLogCalendar from "./_components/DailyLogCalendar";
import { getDailyLogs } from "./actions";

export default async function CalendarPage() {
  const dailyLogs = await getDailyLogs();

  if (!dailyLogs) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-muted-foreground">
          <p>記録データを取得できませんでした。</p>
          <p className="text-sm mt-1">
            しばらく時間をおいてから再度お試しください。
          </p>
        </div>
      </div>
    );
  }

  return <DailyLogCalendar data={dailyLogs} />;
}
