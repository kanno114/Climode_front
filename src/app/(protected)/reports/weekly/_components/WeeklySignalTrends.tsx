"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { WeeklyReportSignals } from "../types";

interface WeeklySignalTrendsProps {
  signals: WeeklyReportSignals;
}

const WEEKDAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export function WeeklySignalTrends({ signals }: WeeklySignalTrendsProps) {
  // 曜日別集計
  const weekdayStats: Record<number, { count: number; days: number }> = {};
  signals.by_day.forEach((day) => {
    const date = new Date(day.date);
    const wday = date.getDay();
    if (!weekdayStats[wday]) {
      weekdayStats[wday] = { count: 0, days: 0 };
    }
    weekdayStats[wday].count += day.count;
    weekdayStats[wday].days += 1;
  });

  const hasData = signals.by_day.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          シグナル傾向
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 曜日別パターン */}
        {hasData && Object.keys(weekdayStats).length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              曜日別パターン
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(weekdayStats)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([wday, stats]) => {
                  const avg = stats.days > 0 ? stats.count / stats.days : 0;
                  return (
                    <div
                      key={wday}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {WEEKDAY_NAMES[Number(wday)]}曜日
                      </p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">
                        {avg.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        平均/日
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {!hasData && (
          <p className="text-sm text-gray-500 text-center py-4">
            今週はシグナルが検出されませんでした
          </p>
        )}
      </CardContent>
    </Card>
  );
}

