export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export type TimeIconName = "sunrise" | "sun" | "sunset" | "moon";

export type TimeBasedMessage = {
  title: string;
  description: string;
  iconName: TimeIconName;
};

export function getTimeOfDay(date?: Date): TimeOfDay {
  const override = process.env.NEXT_PUBLIC_TIME_OF_DAY_OVERRIDE as
    | TimeOfDay
    | undefined;

  if (
    override === "morning" ||
    override === "afternoon" ||
    override === "evening" ||
    override === "night"
  ) {
    return override;
  }

  const now = date ?? new Date();
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

const TIME_ICON_MAP: Record<TimeOfDay, TimeIconName> = {
  morning: "sunrise",
  afternoon: "sun",
  evening: "sunset",
  night: "moon",
};

export function getTimeBasedMessage(
  timeOfDay: TimeOfDay,
  hasDailyLog: boolean,
  hasReflection: boolean = false,
): TimeBasedMessage {
  const iconName = TIME_ICON_MAP[timeOfDay];

  switch (timeOfDay) {
    case "morning":
      if (hasDailyLog) {
        return {
          title: "おはようございます",
          description: "今日も一日、体調を整えながら過ごしましょう",
          iconName,
        };
      } else {
        return {
          title: "おはようございます",
          description: "今日の体調を入力して、一日をスタートしましょう",
          iconName,
        };
      }
    case "afternoon":
      if (hasDailyLog) {
        return {
          title: "こんにちは",
          description: "午後の時間、体調に気を配りながら過ごしましょう",
          iconName,
        };
      } else {
        return {
          title: "こんにちは",
          description: "今日の体調を記録してみませんか？",
          iconName,
        };
      }
    case "evening":
      if (hasDailyLog) {
        return {
          title: "こんばんは",
          description: hasReflection
            ? "今日一日お疲れ様でした。ゆっくり休んでください"
            : "今日一日お疲れ様でした。一日を振り返りましょう",
          iconName,
        };
      } else {
        return {
          title: "こんばんは",
          description: "今日の体調を記録してみませんか？",
          iconName,
        };
      }
    case "night":
      if (hasDailyLog) {
        return {
          title: "おやすみなさい",
          description: hasReflection
            ? "今日もお疲れ様でした。ゆっくり休んでください"
            : "今日一日を振り返って、一日を締めくくりましょう",
          iconName,
        };
      } else {
        return {
          title: "おやすみなさい",
          description: "今日の体調を記録して、一日を締めくくりましょう",
          iconName,
        };
      }
  }
}
