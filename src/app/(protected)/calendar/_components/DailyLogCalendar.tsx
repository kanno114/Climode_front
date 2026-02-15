"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EventClickArg, EventInput, DatesSetArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@/lib/fullcalendar-locale";
import { useRouter } from "next/navigation";
import { getDailyLogsByMonth } from "../actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DailyLog {
  id: number;
  date: string;
  self_score?: number | null;
}

export default function DailyLogCalendar({
  data,
}: {
  data: DailyLog[] | undefined;
}) {
  const router = useRouter();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [currentLogs, setCurrentLogs] = useState<DailyLog[]>(data ?? []);

  // 月間サマリーの算出
  const summary = useMemo(() => {
    const daysInMonth = new Date(
      currentMonth.year,
      currentMonth.month,
      0,
    ).getDate();
    // 表示中の月のログのみフィルタ（初期データが月跨ぎの場合に対応）
    const monthLogs = currentLogs.filter((log) => {
      const [year, month] = log.date.split("-").map(Number);
      return year === currentMonth.year && month === currentMonth.month;
    });
    const totalRecords = monthLogs.length;
    const good = monthLogs.filter((l) => l.self_score === 3).length;
    const average = monthLogs.filter((l) => l.self_score === 2).length;
    const bad = monthLogs.filter((l) => l.self_score === 1).length;
    return { daysInMonth, totalRecords, good, average, bad };
  }, [currentLogs, currentMonth]);

  // self_scoreに応じた絵文字を返す関数
  const getSelfScoreEmoji = useCallback(
    (selfScore: number | null | undefined): string => {
      if (!selfScore) return "";
      const emojiMap: Record<number, string> = {
        1: "😕",
        2: "😐",
        3: "😊",
      };
      return emojiMap[selfScore] || "";
    },
    [],
  );

  // self_scoreに応じて色・絵文字を決定する関数
  const getScoreConfig = useCallback(
    (selfScore?: number | null) => {
      const isSelfScore = selfScore !== null && selfScore !== undefined;

      if (isSelfScore) {
        const emoji = getSelfScoreEmoji(selfScore);
        if (selfScore === 3) {
          return {
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "#22c55e",
            textColor: "#166534",
            title: `${emoji}`,
            emoji: emoji,
          };
        } else if (selfScore === 2) {
          return {
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            borderColor: "#f59e0b",
            textColor: "#92400e",
            title: `${emoji}`,
            emoji: emoji,
          };
        } else {
          return {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderColor: "#ef4444",
            textColor: "#991b1b",
            title: `${emoji}`,
            emoji: emoji,
          };
        }
      }
      // self_scoreがない場合は記録ありのみ表示
      return {
        backgroundColor: "rgba(148, 163, 184, 0.2)",
        borderColor: "#94a3b8",
        textColor: "#475569",
        title: "記録",
        emoji: "•",
      };
    },
    [getSelfScoreEmoji],
  );

  // データをイベントに変換する関数
  const convertToEvents = useCallback(
    (logs: DailyLog[] | null | undefined) => {
      if (!logs || logs.length === 0) return [];
      return logs.map((log) => {
        const config = getScoreConfig(log.self_score);
        return {
          id: log.id.toString(),
          title: config.title,
          date: log.date,
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          textColor: config.textColor,
          extendedProps: {
            logId: log.id,
            selfScore: log.self_score,
            config: config,
          },
        };
      });
    },
    [getScoreConfig],
  );

  // 初期データを設定（初回表示用）
  useEffect(() => {
    if (data && data.length > 0) {
      setEvents(convertToEvents(data));
      setCurrentLogs(data);
    }
  }, [data, convertToEvents]);

  // 月が変わったときにデータを取得
  const handleDatesSet = useCallback(
    async (dateInfo: DatesSetArg) => {
      const currentStart = dateInfo.view.currentStart;
      const year = currentStart.getFullYear();
      const month = currentStart.getMonth() + 1;

      setCurrentMonth({ year, month });
      setLoading(true);
      try {
        const data = await getDailyLogsByMonth(year, month);
        setEvents(convertToEvents(data));
        setCurrentLogs(data ?? []);
      } catch {
        setEvents([]);
        setCurrentLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [convertToEvents],
  );

  // イベントクリック時の処理（日記詳細ページに遷移）
  const handleEventClick = (arg: EventClickArg) => {
    const logId = arg.event.extendedProps.logId;
    router.push(`/dailylog/${logId}`);
  };

  // 日付クリック時の処理（未記録日への導線）
  const handleDateClick = useCallback(
    (arg: { dateStr: string }) => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const clickedDate = arg.dateStr;

      // 記録がある日はイベントクリックで処理されるのでスキップ
      const hasRecord = currentLogs.some((log) => log.date === clickedDate);
      if (hasRecord) return;

      // 当日の未記録日なら記録ページへ誘導
      if (clickedDate === todayStr) {
        const hour = today.getHours();
        router.push(hour < 15 ? "/morning" : "/evening");
      }
    },
    [currentLogs, router],
  );

  return (
    <div className="space-y-4">
      {/* 月間サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">月間サマリー</CardTitle>
          <CardDescription>
            {currentMonth.year}年{currentMonth.month}月の記録状況
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {summary.totalRecords}
                <span className="text-sm font-normal text-muted-foreground">
                  /{summary.daysInMonth}日
                </span>
              </div>
              <div className="text-xs text-muted-foreground">記録日数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.good}
                <span className="text-sm font-normal">日</span>
              </div>
              <div className="text-xs text-muted-foreground">😊 良い</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {summary.average}
                <span className="text-sm font-normal">日</span>
              </div>
              <div className="text-xs text-muted-foreground">😐 普通</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {summary.bad}
                <span className="text-sm font-normal">日</span>
              </div>
              <div className="text-xs text-muted-foreground">😕 悪い</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* カレンダー */}
      <Card>
        <CardContent className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10 rounded-lg">
              <div className="text-muted-foreground">読み込み中...</div>
            </div>
          )}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev,next today",
            }}
            locale={jaLocale}
            height="auto"
            events={events}
            datesSet={handleDatesSet}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            dayMaxEvents={true}
            weekends={true}
            editable={false}
            eventDisplay="block"
            eventContent={(arg) => {
              const config = arg.event.extendedProps.config;
              const selfScore = arg.event.extendedProps.selfScore;

              return (
                <div className="flex items-center justify-center cursor-pointer hover:opacity-50 transition-opacity duration-200">
                  {selfScore ? (
                    <span style={{ color: config.textColor, fontSize: "20px" }}>
                      {config.emoji}
                    </span>
                  ) : (
                    <span style={{ color: config.textColor, fontSize: "14px" }}>
                      {config.emoji}
                    </span>
                  )}
                </div>
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
