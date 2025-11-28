"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { WeeklyPatterns } from "../types";

interface WeeklyMorningTrendsProps {
  patterns: WeeklyPatterns;
}

const WEEKDAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export function WeeklyMorningTrends({
  patterns,
}: WeeklyMorningTrendsProps) {
  const { weekday_stats } = patterns;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          朝の自己申告傾向
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 曜日別パターン */}
        {Object.keys(weekday_stats).length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              曜日別パターン
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(weekday_stats)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([wday, stats]) => (
                  <div
                    key={wday}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h4 className="font-medium mb-2 text-sm">
                      {WEEKDAY_NAMES[Number(wday)]}曜日
                    </h4>
                    <div className="space-y-1 text-xs">
                      {stats.avg_sleep_hours !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">睡眠</span>
                          <span className="font-semibold">
                            {stats.avg_sleep_hours}時間
                          </span>
                        </div>
                      )}
                      {stats.avg_mood !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">気分</span>
                          <span className="font-semibold">
                            {stats.avg_mood}
                          </span>
                        </div>
                      )}
                      <div className="text-gray-500 mt-1">
                        記録: {stats.count}日
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

