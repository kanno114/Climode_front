import { DailyLogDetail } from "./DailyLogDetail";
import { WeatherSection } from "./WeatherSection";
import Suggestions from "@/app/(protected)/dashboard/_components/Suggestions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDailyLog } from "../actions";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileQuestion,
} from "lucide-react";

interface DailyLogDetailAreaProps {
  id: string;
}

export async function DailyLogDetailArea({ id }: DailyLogDetailAreaProps) {
  const dailyLog = await getDailyLog(id);

  if (!dailyLog) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-1">
            <p className="text-lg font-medium">記録が見つかりません</p>
            <p className="text-sm text-muted-foreground">
              この記録は削除されたか、アクセス権がありません。
            </p>
          </div>
          <Link
            href="/calendar"
            className="text-sm text-primary hover:underline"
          >
            カレンダーに戻る
          </Link>
        </CardContent>
      </Card>
    );
  }

  const suggestions = Array.isArray(dailyLog.daily_log_suggestions)
    ? dailyLog.daily_log_suggestions
    : [];

  const date = new Date(dailyLog.date + "T00:00:00");
  const dateLabel = date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const navigation = dailyLog.navigation;
  const weatherSnapshot = dailyLog.weather_snapshot;
  const prefecture = dailyLog.prefecture;

  return (
    <div className="space-y-4">
      {/* 日付ヘッダー + ナビゲーション */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            {navigation?.prev_id ? (
              <Link
                href={`/dailylog/${navigation.prev_id}`}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="前日の記録"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            ) : (
              <div className="p-2">
                <ChevronLeft className="h-5 w-5 text-muted-foreground/30" />
              </div>
            )}

            <CardTitle className="text-lg sm:text-xl text-center">
              {dateLabel}の記録
            </CardTitle>

            {navigation?.next_id ? (
              <Link
                href={`/dailylog/${navigation.next_id}`}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="翌日の記録"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            ) : (
              <div className="p-2">
                <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {/* 体調データ */}
          <DailyLogDetail dailyLog={dailyLog} />

          {/* 気象データ */}
          {weatherSnapshot && (
            <WeatherSection
              weather={weatherSnapshot}
              prefectureName={prefecture?.name_ja}
            />
          )}

          {/* 振り返りメモ */}
          {dailyLog.note && (
            <NoteSection note={dailyLog.note} />
          )}
        </CardContent>
      </Card>

      {/* 行動提案 */}
      <Suggestions
        suggestions={suggestions}
        title="行動提案"
        emptyTitle="行動提案"
        emptyMessage="この日は特別な提案はありませんでした"
      />
    </div>
  );
}

function NoteSection({ note }: { note: string }) {
  return (
    <div className="space-y-2 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="text-base">📝</span>
        振り返りメモ
      </div>
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {note}
        </p>
      </div>
    </div>
  );
}
