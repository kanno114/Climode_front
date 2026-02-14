"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bed, Heart, Star } from "lucide-react";

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

export function DailyLogDetail({ dailyLog }: DailyLogDetailProps) {
  const moodScore = dailyLog.mood;

  const getSelfScoreLabel = (score: number | null | undefined) => {
    if (!score) return null;
    const labels: Record<number, string> = {
      1: "悪い",
      2: "普通",
      3: "良い",
    };
    return labels[score] || null;
  };

  const selfScoreLabel = getSelfScoreLabel(dailyLog.self_score);
  const fatigueLabel = (() => {
    if (dailyLog.fatigue == null) return null;
    if (dailyLog.fatigue >= 4) return "とても軽い";
    if (dailyLog.fatigue >= 3) return "軽い";
    if (dailyLog.fatigue >= 2) return "普通";
    if (dailyLog.fatigue >= 1) return "重い";
    return "とても重い";
  })();

  // 睡眠時間の視覚要素
  const getSleepEmoji = (hours: number | null | undefined) => {
    if (hours == null || hours === 0) return "😴"; // デフォルト
    if (hours >= 8) return "😴";
    if (hours >= 6) return "😌";
    if (hours >= 4) return "😪";
    return "😵";
  };

  const getSleepLabel = (hours: number | null | undefined) => {
    if (hours == null || hours === 0) return null;
    if (hours >= 8) return "十分";
    if (hours >= 6) return "やや短め";
    if (hours >= 4) return "短め";
    return "かなり短い";
  };

  // 気分スコアの視覚要素（1〜5）
  const getMoodEmoji = (value: number | null | undefined) => {
    if (value == null) return "😐"; // デフォルト
    if (value >= 4) return "😊"; // 4-5: 良い
    if (value >= 3) return "🙂"; // 3: 普通
    if (value >= 2) return "😕"; // 2: やや悪い
    return "😢"; // 1: 悪い
  };

  const sleepLabel = getSleepLabel(dailyLog.sleep_hours);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="h-4 w-4" />
          <span>記録</span>
          </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* セルフスコア（バッジ＋3段階ラベル） */}
        {dailyLog.self_score !== undefined && selfScoreLabel && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">セルフスコア</span>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="text-sm font-semibold">
                {dailyLog.self_score}
              </span>
              <span className="text-xs text-muted-foreground">
                ({selfScoreLabel})
              </span>
            </Badge>
          </div>
        )}

        {/* 詳細グリッド: 睡眠時間 / 気分スコア / 疲労度 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bed className="h-4 w-4" />
              <span className="font-medium">睡眠時間</span>
            </div>
            <div className="text-base flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="睡眠状態">
                {getSleepEmoji(dailyLog.sleep_hours)}
              </span>
              <span>
                {dailyLog.sleep_hours ?? "-"}
                <span className="ml-1 text-xs text-muted-foreground">時間</span>
              </span>
              {sleepLabel && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({sleepLabel})
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="font-medium">気分スコア</span>
            </div>
            <div className="text-base flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="気分状態">
                {getMoodEmoji(moodScore)}
              </span>
              <span>
                {moodScore ?? "-"}
                <span className="ml-1 text-xs text-muted-foreground">
                  （1〜5）
                </span>
              </span>
            </div>
          </div>

          {dailyLog.fatigue != null && (
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                <span className="font-medium">疲労度</span>
              </div>
              <div className="text-base">
                {dailyLog.fatigue}
                <span className="ml-1 text-xs text-muted-foreground">
                  （1〜5）
                </span>
                {fatigueLabel && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {fatigueLabel}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 振り返りメモ */}
        {dailyLog.note && (
          <div className="space-y-1 pt-2 border-t">
            <div className="text-sm font-medium text-muted-foreground">
              振り返りメモ
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              {dailyLog.note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
