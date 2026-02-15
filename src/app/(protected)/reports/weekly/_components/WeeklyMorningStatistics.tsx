"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyStatistics } from "../types";
import { BarChart3, Moon, Smile, Activity } from "lucide-react";

interface WeeklyMorningStatisticsProps {
  statistics: WeeklyStatistics;
}

function MetricCard({
  icon: Icon,
  label,
  mean,
  median,
  min,
  max,
  unit,
  colorClass,
  bgClass,
  borderClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  mean: number;
  median: number | null;
  min: number | null;
  max: number | null;
  unit: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}) {
  return (
    <div className={`p-4 ${bgClass} rounded-lg border ${borderClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${colorClass}`} />
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </h4>
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {mean.toFixed(1)}
        <span className="text-sm font-normal ml-0.5">{unit}</span>
      </p>
      {median != null && min != null && max != null && (
        <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>中央値: {median}{unit}</span>
          <span>
            範囲: {min}〜{max}{unit}
          </span>
        </div>
      )}
    </div>
  );
}

export function WeeklyMorningStatistics({
  statistics,
}: WeeklyMorningStatisticsProps) {
  const { health_metrics } = statistics;

  const hasAnyData =
    health_metrics.sleep_hours.mean !== null ||
    health_metrics.mood.mean !== null ||
    health_metrics.fatigue_level.mean !== null;

  if (!hasAnyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            朝の自己申告統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週は記録がありませんでした
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          朝の自己申告統計
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {health_metrics.sleep_hours.mean !== null && (
          <MetricCard
            icon={Moon}
            label="睡眠時間"
            mean={health_metrics.sleep_hours.mean}
            median={health_metrics.sleep_hours.median}
            min={health_metrics.sleep_hours.min}
            max={health_metrics.sleep_hours.max}
            unit="h"
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-50 dark:bg-blue-900/20"
            borderClass="border-blue-100 dark:border-blue-800"
          />
        )}
        {health_metrics.mood.mean !== null && (
          <MetricCard
            icon={Smile}
            label="気分"
            mean={health_metrics.mood.mean}
            median={health_metrics.mood.median}
            min={health_metrics.mood.min}
            max={health_metrics.mood.max}
            unit="/5"
            colorClass="text-pink-600 dark:text-pink-400"
            bgClass="bg-pink-50 dark:bg-pink-900/20"
            borderClass="border-pink-100 dark:border-pink-800"
          />
        )}
        {health_metrics.fatigue_level.mean !== null && (
          <MetricCard
            icon={Activity}
            label="疲労感"
            mean={health_metrics.fatigue_level.mean}
            median={health_metrics.fatigue_level.median}
            min={health_metrics.fatigue_level.min}
            max={health_metrics.fatigue_level.max}
            unit="/5"
            colorClass="text-orange-600 dark:text-orange-400"
            bgClass="bg-orange-50 dark:bg-orange-900/20"
            borderClass="border-orange-100 dark:border-orange-800"
          />
        )}
      </CardContent>
    </Card>
  );
}
