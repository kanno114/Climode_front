"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import type { WeeklyReportSignals } from "../types";

interface WeeklySignalStatisticsProps {
  signals: WeeklyReportSignals;
}

export function WeeklySignalStatistics({
  signals,
}: WeeklySignalStatisticsProps) {
  // レベル別集計
  const levelTotals = signals.by_trigger.reduce(
    (acc, trigger) => ({
      strong: acc.strong + trigger.strong,
      attention: acc.attention + trigger.attention,
      warning: acc.warning + trigger.warning,
    }),
    { strong: 0, attention: 0, warning: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          シグナル統計
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 総発火数 */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            総発火数
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {signals.total}
          </p>
        </div>

        {/* レベル別集計 */}
        {signals.total > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              レベル別集計
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  強
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {levelTotals.strong}
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  警戒
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {levelTotals.warning}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  注意
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {levelTotals.attention}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* トリガー別内訳 */}
        {signals.by_trigger.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              トリガー別内訳
            </p>
            <div className="space-y-3">
              {signals.by_trigger.map((trigger) => (
                <div
                  key={trigger.trigger_key}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {trigger.trigger_key.replace(/_/g, " ")}
                    </span>
                    <Badge variant="secondary">{trigger.count}回</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {trigger.strong > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        強: {trigger.strong}
                      </Badge>
                    )}
                    {trigger.warning > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-orange-300 text-orange-700"
                      >
                        警戒: {trigger.warning}
                      </Badge>
                    )}
                    {trigger.attention > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-yellow-300 text-yellow-700"
                      >
                        注意: {trigger.attention}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {signals.by_trigger.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            今週はシグナルが検出されませんでした
          </p>
        )}
      </CardContent>
    </Card>
  );
}
