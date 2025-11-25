"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Sunset, Sunrise } from "lucide-react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface TimeBasedContentProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    memo?: string;
    note?: string | null;
    score: number;
    helpfulness?: number | null;
    match_score?: number | null;
    prefecture?: {
      id: number;
      name_ja: string;
    };
    suggestion_feedbacks?: Array<{
      id: number;
      suggestion_key: string;
      helpfulness: boolean;
    }>;
  } | null;
}

function getTimeOfDay(): TimeOfDay {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "evening";
  } else {
    return "night";
  }
}

function getTimeBasedMessage(timeOfDay: TimeOfDay, hasDailyLog: boolean): {
  title: string;
  description: string;
  icon: React.ReactNode;
} {
  switch (timeOfDay) {
    case "morning":
      if (hasDailyLog) {
        return {
          title: "おはようございます",
          description: "今日も一日、体調を整えながら過ごしましょう",
          icon: <Sunrise className="h-6 w-6 text-amber-500" />,
        };
      } else {
        return {
          title: "おはようございます",
          description: "今日の体調を入力して、一日をスタートしましょう",
          icon: <Sunrise className="h-6 w-6 text-amber-500" />,
        };
      }
    case "afternoon":
      if (hasDailyLog) {
        return {
          title: "こんにちは",
          description: "午後の時間、体調に気を配りながら過ごしましょう",
          icon: <Sun className="h-6 w-6 text-yellow-500" />,
        };
      } else {
        return {
          title: "こんにちは",
          description: "今日の体調を記録してみませんか？",
          icon: <Sun className="h-6 w-6 text-yellow-500" />,
        };
      }
    case "evening":
      if (hasDailyLog) {
        return {
          title: "こんばんは",
          description: "今日一日お疲れ様でした。体調を振り返りましょう",
          icon: <Sunset className="h-6 w-6 text-orange-500" />,
        };
      } else {
        return {
          title: "こんばんは",
          description: "今日の体調を記録して、一日を振り返りましょう",
          icon: <Sunset className="h-6 w-6 text-orange-500" />,
        };
      }
    case "night":
      if (hasDailyLog) {
        return {
          title: "おやすみなさい",
          description: "今日もお疲れ様でした。ゆっくり休んでください",
          icon: <Moon className="h-6 w-6 text-indigo-500" />,
        };
      } else {
        return {
          title: "おやすみなさい",
          description: "今日の体調を記録して、一日を締めくくりましょう",
          icon: <Moon className="h-6 w-6 text-indigo-500" />,
        };
      }
  }
}

export function TimeBasedContent({
  dailyLog,
}: TimeBasedContentProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());

    // 時間帯が変わる可能性があるので、1時間ごとにチェック
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60 * 60 * 1000); // 1時間ごと

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // サーバーとクライアントの時刻差を避けるため、初期レンダリング時は空を返す
    return null;
  }

  const hasDailyLog = dailyLog !== null;
  const message = getTimeBasedMessage(timeOfDay, hasDailyLog);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          {message.icon}
          <div>
            <CardTitle className="text-xl">{message.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {message.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 時間帯に応じた追加情報を表示する場合はここに追加 */}
        <div className="text-sm text-muted-foreground">
          {timeOfDay === "morning" && hasDailyLog && (
            <p>今日も良い一日になりますように 🌅</p>
          )}
          {timeOfDay === "afternoon" && hasDailyLog && (
            <p>午後も体調に気をつけて過ごしましょう ☀️</p>
          )}
          {timeOfDay === "evening" && hasDailyLog && (
            <p>今日一日の振り返りをしてみませんか？ 🌆</p>
          )}
          {timeOfDay === "night" && hasDailyLog && (
            <p>ゆっくり休んで、明日に備えましょう 🌙</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

