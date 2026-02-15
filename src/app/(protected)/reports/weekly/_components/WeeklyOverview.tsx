"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Moon,
  Smile,
  Activity,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  CloudRain,
  ArrowRightLeft,
} from "lucide-react";
import type {
  WeeklyReport,
  Correlations,
  WeeklyPatterns,
  WeeklyStatistics,
} from "../types";

interface WeeklyOverviewProps {
  report: WeeklyReport;
}

function formatCorrelationLabel(key: string): string {
  const labels: Record<string, string> = {
    temperature_mood: "気温 → 気分",
    temperature_fatigue: "気温 → 疲労",
    temperature_sleep: "気温 → 睡眠",
    humidity_mood: "湿度 → 気分",
    humidity_fatigue: "湿度 → 疲労",
    humidity_sleep: "湿度 → 睡眠",
    pressure_mood: "気圧 → 気分",
    pressure_fatigue: "気圧 → 疲労",
    pressure_sleep: "気圧 → 睡眠",
    pressure_drop_6h_mood: "気圧変動(6h) → 気分",
    pressure_drop_6h_fatigue: "気圧変動(6h) → 疲労",
    pressure_drop_6h_sleep: "気圧変動(6h) → 睡眠",
    pressure_drop_24h_mood: "気圧変動(24h) → 気分",
    pressure_drop_24h_fatigue: "気圧変動(24h) → 疲労",
    pressure_drop_24h_sleep: "気圧変動(24h) → 睡眠",
    mood_fatigue: "気分 ↔ 疲労",
    sleep_mood: "睡眠 ↔ 気分",
  };
  return labels[key] ?? key;
}

function CorrelationBar({ value }: { value: number }) {
  const absValue = Math.abs(value);
  const width = Math.min(absValue * 100, 100);
  const isPositive = value >= 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isPositive
              ? "bg-blue-500 dark:bg-blue-400"
              : "bg-orange-500 dark:bg-orange-400"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={`text-xs font-mono w-12 text-right ${
          absValue >= 0.5
            ? "font-bold"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {value >= 0 ? "+" : ""}
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function CorrelationsSection({
  correlations,
}: {
  correlations: Correlations;
}) {
  const weatherEntries = Object.entries(
    correlations.weather_health_correlations
  ).filter(([, v]) => v !== null) as [string, number][];

  const healthEntries = Object.entries(
    correlations.health_health_correlations
  ).filter(([, v]) => v !== null) as [string, number][];

  if (weatherEntries.length === 0 && healthEntries.length === 0) {
    return null;
  }

  // Sort by absolute value to show strongest correlations first
  const sortedWeather = [...weatherEntries].sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ArrowRightLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          相関分析
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather-Health Correlations */}
        {sortedWeather.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <CloudRain className="h-3 w-3" />
              天気 × 体調
            </p>
            <div className="space-y-2">
              {sortedWeather.map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {formatCorrelationLabel(key)}
                  </p>
                  <CorrelationBar value={value} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health-Health Correlations */}
        {healthEntries.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              体調指標間
            </p>
            <div className="space-y-2">
              {healthEntries.map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {formatCorrelationLabel(key)}
                  </p>
                  <CorrelationBar value={value} />
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500">
          相関係数: +1.0（強い正の相関）〜 -1.0（強い負の相関）
        </p>
      </CardContent>
    </Card>
  );
}

function WeekHalfComparisonSection({
  patterns,
}: {
  patterns: WeeklyPatterns;
}) {
  const { week_half_comparison } = patterns;

  if (!week_half_comparison) {
    return null;
  }

  const { first_half_avg, second_half_avg, score_diff } = week_half_comparison;
  const isBetter = score_diff > 0;
  const isEqual = score_diff === 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ArrowRightLeft className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          週の前半・後半比較
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              前半（月〜水）
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {first_half_avg.toFixed(1)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              後半（木〜日）
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {second_half_avg.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1 text-sm">
          {isEqual ? (
            <>
              <Minus className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">差なし</span>
            </>
          ) : isBetter ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400">
                後半が +{score_diff.toFixed(1)} 改善
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-600 dark:text-orange-400">
                後半が {score_diff.toFixed(1)} 低下
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WeekComparisonSection({
  statistics,
}: {
  statistics: WeeklyStatistics;
}) {
  const comparison = statistics.weekly_comparison;
  if (!comparison || comparison.current_avg == null) {
    return null;
  }

  const { current_avg, previous_avg, score_diff } = comparison;
  const hasPrevious = previous_avg != null && score_diff != null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          先週との比較
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasPrevious ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                先週
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {previous_avg!.toFixed(1)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                今週
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {current_avg.toFixed(1)}
              </p>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-1 text-sm">
              {score_diff! > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">
                    +{score_diff!.toFixed(1)} 改善
                  </span>
                </>
              ) : score_diff! < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-orange-600 dark:text-orange-400">
                    {score_diff!.toFixed(1)} 低下
                  </span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">変動なし</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            先週のデータがないため比較できません
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function WeeklyOverview({ report }: WeeklyOverviewProps) {
  const { statistics, correlations, patterns, daily, feedback } = report;
  const { health_metrics } = statistics;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
          <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">平均睡眠</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {health_metrics.sleep_hours.mean != null
              ? `${health_metrics.sleep_hours.mean}h`
              : "-"}
          </p>
        </div>
        <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-100 dark:border-pink-800 text-center">
          <Smile className="h-5 w-5 text-pink-600 dark:text-pink-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">平均気分</p>
          <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
            {health_metrics.mood.mean != null
              ? `${health_metrics.mood.mean.toFixed(1)}`
              : "-"}
          </p>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800 text-center">
          <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">平均疲労</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {health_metrics.fatigue_level.mean != null
              ? `${health_metrics.fatigue_level.mean.toFixed(1)}`
              : "-"}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 text-center">
          <Star className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">セルフスコア</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {feedback.avg_self_score != null
              ? `${feedback.avg_self_score.toFixed(1)}`
              : "-"}
          </p>
        </div>
      </div>

      {/* Record count */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        朝の記録: {daily.by_day.length}日 / 夜の記録:{" "}
        {feedback.by_day.filter((d) => d.has_feedback).length}日
      </p>

      {/* Week Comparison & Half Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeekComparisonSection statistics={statistics} />
        <WeekHalfComparisonSection patterns={patterns} />
      </div>

      {/* Correlations */}
      <CorrelationsSection correlations={correlations} />
    </div>
  );
}
