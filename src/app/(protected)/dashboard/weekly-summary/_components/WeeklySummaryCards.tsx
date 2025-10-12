"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyLogData } from "../actions";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Heart,
  Activity,
} from "lucide-react";

interface WeeklySummaryCardsProps {
  data: DailyLogData[];
}

export function WeeklySummaryCards({ data }: WeeklySummaryCardsProps) {
  // 統計情報を計算
  const scores = data.map((log) => log.score ?? 0);
  const avgScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        )
      : 0;

  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  const maxScoreDay = data.find((log) => log.score === maxScore);
  const minScoreDay = data.find((log) => log.score === minScore);

  // トレンド計算（直近3日と最初3日の平均を比較）
  const recentAvg =
    scores.length >= 3
      ? scores.slice(-3).reduce((sum, score) => sum + score, 0) / 3
      : avgScore;
  const earlyAvg =
    scores.length >= 3
      ? scores.slice(0, 3).reduce((sum, score) => sum + score, 0) / 3
      : avgScore;

  const trendDiff = recentAvg - earlyAvg;
  let trendIcon;
  let trendText;
  let trendColor;

  if (trendDiff > 5) {
    trendIcon = <TrendingUp className="h-5 w-5" />;
    trendText = "改善傾向";
    trendColor = "text-green-600";
  } else if (trendDiff < -5) {
    trendIcon = <TrendingDown className="h-5 w-5" />;
    trendText = "注意が必要";
    trendColor = "text-red-600";
  } else {
    trendIcon = <Minus className="h-5 w-5" />;
    trendText = "安定";
    trendColor = "text-blue-600";
  }

  const recordDays = data.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 平均体調スコア */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            平均体調スコア
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{avgScore}</div>
          <p className="text-xs text-gray-500 mt-1">過去7日間の平均</p>
        </CardContent>
      </Card>

      {/* 体調トレンド */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            体調トレンド
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-2 ${trendColor}`}>
            {trendIcon}
            <span className="text-2xl font-bold">{trendText}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {trendDiff > 0 ? "+" : ""}
            {trendDiff.toFixed(1)}点の変化
          </p>
        </CardContent>
      </Card>

      {/* 最高スコアの日 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            最高スコアの日
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{maxScore}</div>
          {maxScoreDay && (
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(maxScoreDay.date), "M月d日 (E)", { locale: ja })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 最低スコアの日 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            最低スコアの日
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{minScore}</div>
          {minScoreDay && (
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(minScoreDay.date), "M月d日 (E)", { locale: ja })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 記録継続日数 */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            今週の記録
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-600">
              {recordDays}
            </span>
            <span className="text-lg text-gray-600">日記録</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            継続的な記録が体調管理の鍵です
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
