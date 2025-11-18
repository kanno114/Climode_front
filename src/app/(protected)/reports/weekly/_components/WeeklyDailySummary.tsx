import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Heart, Activity } from "lucide-react";
import type { WeeklyReportDaily } from "../types";

interface WeeklyDailySummaryProps {
  daily: WeeklyReportDaily;
}

export function WeeklyDailySummary({ daily }: WeeklyDailySummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>自己申告の傾向</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 平均睡眠時間 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bed className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                平均睡眠時間
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {daily.avg_sleep_hours !== null
                ? `${daily.avg_sleep_hours.toFixed(1)}時間`
                : "-"}
            </p>
          </div>

          {/* 平均気分 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                平均気分
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {daily.avg_mood !== null ? daily.avg_mood.toFixed(1) : "-"}
            </p>
            {daily.avg_mood !== null && (
              <p className="text-xs text-gray-500 mt-1">(-5〜5)</p>
            )}
          </div>

          {/* 平均疲労感レベル */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                平均疲労感レベル
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {daily.avg_fatigue_level !== null
                ? daily.avg_fatigue_level.toFixed(1)
                : "-"}
            </p>
            {daily.avg_fatigue_level !== null && (
              <p className="text-xs text-gray-500 mt-1">(1〜5)</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

