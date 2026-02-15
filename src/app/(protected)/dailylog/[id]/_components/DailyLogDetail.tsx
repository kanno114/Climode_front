"use client";

import { Bed, Heart, Star, Activity } from "lucide-react";

interface DailyLogDetailProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    note?: string | null;
    self_score?: number;
    fatigue?: number | null;
    prefecture?: {
      id: number;
      name_ja: string;
    };
  };
}

const SELF_SCORE_CONFIG: Record<
  number,
  { label: string; color: string; bgColor: string }
> = {
  1: {
    label: "悪い",
    color: "bg-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  2: {
    label: "普通",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  3: {
    label: "良い",
    color: "bg-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
};

function ScoreBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function ScaleDots({
  value,
  max,
  activeColor,
}: {
  value: number;
  max: number;
  activeColor: string;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`h-2.5 w-2.5 rounded-full transition-all ${
            i < value ? activeColor : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function getSleepBarColor(hours: number): string {
  if (hours >= 7) return "bg-green-500";
  if (hours >= 6) return "bg-yellow-500";
  if (hours >= 4) return "bg-orange-500";
  return "bg-red-500";
}

function getSleepLabel(hours: number | null | undefined): string | null {
  if (hours == null || hours === 0) return null;
  if (hours >= 8) return "十分";
  if (hours >= 7) return "適切";
  if (hours >= 6) return "やや短め";
  if (hours >= 4) return "短め";
  return "かなり短い";
}

function getMoodColor(value: number): string {
  if (value >= 4) return "bg-green-500";
  if (value >= 3) return "bg-yellow-500";
  if (value >= 2) return "bg-orange-500";
  return "bg-red-500";
}

function getFatigueColor(value: number): string {
  // 疲労度: 高い値 = 軽い（良い状態）
  if (value >= 4) return "bg-green-500";
  if (value >= 3) return "bg-yellow-500";
  if (value >= 2) return "bg-orange-500";
  return "bg-red-500";
}

function getFatigueLabel(value: number | null | undefined): string | null {
  if (value == null) return null;
  if (value >= 4) return "とても軽い";
  if (value >= 3) return "軽い";
  if (value >= 2) return "普通";
  if (value >= 1) return "重い";
  return "とても重い";
}

export function DailyLogDetail({ dailyLog }: DailyLogDetailProps) {
  const selfScoreConfig = dailyLog.self_score
    ? SELF_SCORE_CONFIG[dailyLog.self_score]
    : null;
  const sleepLabel = getSleepLabel(dailyLog.sleep_hours);
  const fatigueLabel = getFatigueLabel(dailyLog.fatigue);

  return (
    <div className="space-y-4">
      {/* セルフスコア */}
      {dailyLog.self_score != null && selfScoreConfig && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm shrink-0">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">セルフスコア</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ScaleDots
              value={dailyLog.self_score}
              max={3}
              activeColor={selfScoreConfig.color}
            />
            <span className="text-sm font-medium ml-1">
              {selfScoreConfig.label}
            </span>
          </div>
        </div>
      )}

      {/* メトリクスグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 睡眠時間 */}
        <div className="space-y-2 rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bed className="h-4 w-4" />
              <span className="font-medium">睡眠時間</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-lg font-semibold">
                {dailyLog.sleep_hours ?? "-"}
              </span>
              <span className="text-xs text-muted-foreground">時間</span>
              {sleepLabel && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({sleepLabel})
                </span>
              )}
            </div>
          </div>
          <ScoreBar
            value={dailyLog.sleep_hours ?? 0}
            max={10}
            color={getSleepBarColor(dailyLog.sleep_hours ?? 0)}
          />
        </div>

        {/* 気分スコア */}
        <div className="space-y-2 rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="font-medium">気分</span>
            </div>
            <span className="text-lg font-semibold">
              {dailyLog.mood ?? "-"}
              <span className="text-xs text-muted-foreground ml-1">/ 5</span>
            </span>
          </div>
          <ScaleDots
            value={dailyLog.mood ?? 0}
            max={5}
            activeColor={getMoodColor(dailyLog.mood ?? 0)}
          />
        </div>

        {/* 疲労度 */}
        {dailyLog.fatigue != null && (
          <div className="space-y-2 rounded-lg bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="font-medium">疲労度</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-lg font-semibold">
                  {dailyLog.fatigue}
                </span>
                <span className="text-xs text-muted-foreground">/ 5</span>
                {fatigueLabel && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({fatigueLabel})
                  </span>
                )}
              </div>
            </div>
            <ScaleDots
              value={dailyLog.fatigue}
              max={5}
              activeColor={getFatigueColor(dailyLog.fatigue)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
