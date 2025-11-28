"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyStatistics } from "../types";
import { BarChart3, Moon, Smile, Activity } from "lucide-react";

interface WeeklyMorningStatisticsProps {
  statistics: WeeklyStatistics;
}

export function WeeklyMorningStatistics({
  statistics,
}: WeeklyMorningStatisticsProps) {
  const { health_metrics } = statistics;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          朝の自己申告統計
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 睡眠時間 */}
        {health_metrics.sleep_hours.mean !== null && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                睡眠時間
              </h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  平均
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {health_metrics.sleep_hours.mean}時間
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200 dark:border-blue-800">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    中央値
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {health_metrics.sleep_hours.median}時間
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    範囲
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {health_metrics.sleep_hours.min} -{" "}
                    {health_metrics.sleep_hours.max}時間
                  </p>
                </div>
                {health_metrics.sleep_hours.std_dev !== null && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      標準偏差
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {health_metrics.sleep_hours.std_dev.toFixed(2)}時間
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 気分 */}
        {health_metrics.mood.mean !== null && (
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800">
            <div className="flex items-center gap-2 mb-3">
              <Smile className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                気分
              </h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  平均
                </p>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {health_metrics.mood.mean.toFixed(1)} / 5
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-pink-200 dark:border-pink-800">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    中央値
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {health_metrics.mood.median}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    範囲
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {health_metrics.mood.min} - {health_metrics.mood.max}
                  </p>
                </div>
                {health_metrics.mood.std_dev !== null && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      標準偏差
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {health_metrics.mood.std_dev.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 疲労感 */}
        {health_metrics.fatigue_level.mean !== null && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                疲労感
              </h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  平均
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {health_metrics.fatigue_level.mean.toFixed(1)} / 5
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200 dark:border-orange-800">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    中央値
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {health_metrics.fatigue_level.median}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    範囲
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {health_metrics.fatigue_level.min} -{" "}
                    {health_metrics.fatigue_level.max}
                  </p>
                </div>
                {health_metrics.fatigue_level.std_dev !== null && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      標準偏差
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {health_metrics.fatigue_level.std_dev.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
