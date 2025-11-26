import { DailyLogDetail } from "./DailyLogDetail";
import { SignalsList } from "@/app/(protected)/dashboard/_components/SignalsList";
import Suggestions from "@/app/(protected)/dashboard/_components/Suggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDailyLog,
  getSignalsByDate,
  getSuggestionsByDate,
} from "../actions";

interface DailyLogDetailAreaProps {
  id: string;
}

export async function DailyLogDetailArea({ id }: DailyLogDetailAreaProps) {
  const dailyLog = await getDailyLog(id);

  if (!dailyLog) {
    return null;
  }

  const [signals, suggestions] = await Promise.all([
    getSignalsByDate(dailyLog.date),
    getSuggestionsByDate(dailyLog.date),
  ]);

  const normalizedSignals = Array.isArray(signals) ? signals : [];
  const normalizedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const hasSignalError = signals === null;

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

        <SignalsList
          signals={normalizedSignals}
          hasError={hasSignalError}
          title="シグナル"
          emptyTitle="シグナル"
          emptyMessage="この日は特に注意する点はありませんでした ☀️"
          emptySubMessage="穏やかなコンディションで過ごせたようです。"
        />

        <Suggestions
          suggestions={normalizedSuggestions}
          title="行動提案"
          emptyTitle="行動提案"
          emptyMessage="この日は特別な提案はありませんでした"
        />
      </CardContent>
    </Card>
  );
}
