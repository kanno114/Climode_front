"use client";

import { useEffect, useState, useCallback } from "react";
import { EventClickArg, EventInput, DatesSetArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import jaLocale from "@/lib/fullcalendar-locale";
import { Meh, Frown, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { getDailyLogsByMonth } from "../actions";

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

  // self_scoreに応じた絵文字を返す関数
  const getSelfScoreEmoji = useCallback(
    (selfScore: number | null | undefined): string => {
      if (!selfScore) return "";
      const emojiMap: Record<number, string> = {
        1: "😕", // 悪い
        2: "😐", // 普通
        3: "😊", // 良い
      };
      return emojiMap[selfScore] || "";
    },
    []
  );

  // self_scoreに応じてアイコンと色を決定する関数（記録のみの場合は「記録あり」表示）
  const getScoreConfig = useCallback(
    (selfScore?: number | null) => {
      const isSelfScore = selfScore !== null && selfScore !== undefined;

      if (isSelfScore) {
        const emoji = getSelfScoreEmoji(selfScore);
        if (selfScore === 3) {
          return {
            icon: Heart,
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "#22c55e",
            textColor: "#166534",
            title: `${emoji}`,
            emoji: emoji,
          };
        } else if (selfScore === 2) {
          return {
            icon: Meh,
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            borderColor: "#f59e0b",
            textColor: "#92400e",
            title: `${emoji}`,
            emoji: emoji,
          };
        } else {
          return {
            icon: Frown,
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
        icon: Meh,
        backgroundColor: "rgba(148, 163, 184, 0.2)",
        borderColor: "#94a3b8",
        textColor: "#475569",
        title: "記録",
        emoji: "•",
      };
    },
    [getSelfScoreEmoji]
  );

  // データをイベントに変換する関数
  const convertToEvents = useCallback(
    (logs: DailyLog[] | null | undefined) => {
      if (!logs || logs.length === 0) {
        return [];
      }
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
    [getScoreConfig]
  );

  // 初期データを設定（初回表示用）
  useEffect(() => {
    if (data && data.length > 0) {
      setEvents(convertToEvents(data));
    }
  }, [data, convertToEvents]);

  // 月が変わったときにデータを取得
  const handleDatesSet = useCallback(
    async (dateInfo: DatesSetArg) => {
      // currentStart は「そのビューの月の1日」
      const currentStart = dateInfo.view.currentStart;
      const year = currentStart.getFullYear();
      const month = currentStart.getMonth() + 1; // 0-indexedなので+1

      setLoading(true);
      try {
        const data = await getDailyLogsByMonth(year, month);
        setEvents(convertToEvents(data));
      } catch (error) {
        console.error("データ取得エラー:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [convertToEvents]
  );

  // イベントクリック時の処理 日記詳細ページに遷移
  const handleEventClick = (arg: EventClickArg) => {
    const logId = arg.event.extendedProps.logId;
    router.push(`/dailylog/${logId}`);
  };

  return (
    <div className="w-full h-[600px] bg-transparent rounded-lg p-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-lg">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "title",
          center: "",
          right: "prev,next today",
        }}
        locale={jaLocale}
        height="100%"
        events={events}
        datesSet={handleDatesSet}
        dateClick={() => {}}
        eventClick={handleEventClick}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        editable={false}
        selectConstraint="businessHours"
        businessHours={{
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startTime: "00:00",
          endTime: "23:59",
        }}
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
    </div>
  );
}
