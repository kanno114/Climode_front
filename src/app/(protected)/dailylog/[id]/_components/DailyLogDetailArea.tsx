import { DailyLogDetail } from "./DailyLogDetail";
import Suggestions from "@/app/(protected)/dashboard/_components/Suggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyLog } from "../actions";

interface DailyLogDetailAreaProps {
  id: string;
}

export async function DailyLogDetailArea({ id }: DailyLogDetailAreaProps) {
  const dailyLog = await getDailyLog(id);

  if (!dailyLog) {
    return null;
  }

  const suggestions = Array.isArray(dailyLog.daily_log_suggestions)
    ? dailyLog.daily_log_suggestions
    : [];

  const dateLabel = new Date(dailyLog.date).toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dateLabel}の記録</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DailyLogDetail dailyLog={dailyLog} />

        <Suggestions
          suggestions={suggestions}
          title="行動提案"
          emptyTitle="行動提案"
          emptyMessage="この日は特別な提案はありませんでした"
        />
      </CardContent>
    </Card>
  );
}
