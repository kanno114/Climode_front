"use client";

import { useEffect, useState } from "react";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import jaLocale from "@/lib/fullcalendar-locale";
import { Smile, Meh, Frown, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface DailyLog {
  id: number;
  date: string;
  score: number;
}

export default function DailyLogCalendar({
  data,
}: {
  data: DailyLog[] | undefined;
}) {
  const router = useRouter();
  const [events, setEvents] = useState<EventInput[]>([]);

  // スコアに応じてアイコンと色を決定する関数
  const getScoreConfig = (score: number) => {
    if (score >= 80) {
      return {
        icon: Heart,
        backgroundColor: "rgba(34, 197, 94, 0.2)", // 緑色（透明）
        borderColor: "#22c55e",
        textColor: "#166534",
        title: `😊 ${score}点`,
      };
    } else if (score >= 60) {
      return {
        icon: Smile,
        backgroundColor: "rgba(59, 130, 246, 0.2)", // 青色（透明）
        borderColor: "#3b82f6",
        textColor: "#1e40af",
        title: `🙂 ${score}点`,
      };
    } else if (score >= 40) {
      return {
        icon: Meh,
        backgroundColor: "rgba(245, 158, 11, 0.2)", // オレンジ色（透明）
        borderColor: "#f59e0b",
        textColor: "#92400e",
        title: `😐 ${score}点`,
      };
    } else if (score >= 20) {
      return {
        icon: Frown,
        backgroundColor: "rgba(239, 68, 68, 0.2)", // 赤色（透明）
        borderColor: "#ef4444",
        textColor: "#991b1b",
        title: `😞 ${score}点`,
      };
    } else {
      return {
        icon: Frown,
        backgroundColor: "rgba(107, 114, 128, 0.2)", // グレー（透明）
        borderColor: "#6b7280",
        textColor: "#374151",
        title: `😢 ${score}点`,
      };
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const calendarEvents: EventInput[] = data.map((log) => {
        const config = getScoreConfig(log.score);
        return {
          id: log.id.toString(),
          title: config.title,
          date: log.date,
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          textColor: config.textColor,
          extendedProps: {
            logId: log.id,
            score: log.score,
            config: config,
          },
        };
      });
      setEvents(calendarEvents);
    }
  }, [data]);

  // イベントクリック時の処理 日記詳細ページに遷移
  const handleEventClick = (arg: EventClickArg) => {
    const logId = arg.event.extendedProps.logId;
    router.push(`/dailylog/${logId}`);
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[600px] bg-transparent rounded-lg p-4 flex items-center justify-center">
        <div className="text-gray-500 text-lg">日記はありません。</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-transparent rounded-lg p-4">
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
          const IconComponent = config.icon;

          return (
            <div className="flex items-center justify-center cursor-pointer hover:opacity-50 transition-opacity duration-200">
              <IconComponent
                size={25}
                className="mr-1"
                style={{ color: config.textColor }}
              />
              <span style={{ color: config.textColor, fontSize: "12px" }}>
                {arg.event.extendedProps.score}点
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}
