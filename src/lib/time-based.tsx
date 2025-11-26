import React from "react";
import { Sun, Moon, Sunset, Sunrise } from "lucide-react";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(): TimeOfDay {
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

export function getTimeBasedMessage(
  timeOfDay: TimeOfDay,
  hasDailyLog: boolean
): {
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
