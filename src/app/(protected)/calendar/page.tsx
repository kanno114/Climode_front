import DailyLogCalendar from "./_components/DailyLogCalendar";
import { getDailyLogs } from "./actions";

export default async function CalendarPage() {
  const dailyLogs = await getDailyLogs();

  if (!dailyLogs) {
    return <div>No daily logs found</div>;
  }

  return <DailyLogCalendar data={dailyLogs} />;
}
