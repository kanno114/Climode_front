"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { WeeklyReportFeedback } from "../types";

interface WeeklyEveningTrendsProps {
  feedback: WeeklyReportFeedback;
}

const WEEKDAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export function WeeklyEveningTrends({
  feedback,
}: WeeklyEveningTrendsProps) {
  // 曜日別集計
  const weekdayStats: Record<
    number,
    { 
      feedbackCount: number; 
      helpfulCount: number; 
      totalDays: number;
      selfScores: number[];
    }
  > = {};

  feedback.by_day.forEach((day) => {
    const date = new Date(day.date);
    const wday = date.getDay();
    if (!weekdayStats[wday]) {
      weekdayStats[wday] = {
        feedbackCount: 0,
        helpfulCount: 0,
        totalDays: 0,
        selfScores: [],
      };
    }
    weekdayStats[wday].totalDays += 1;
    if (day.has_feedback) {
      weekdayStats[wday].feedbackCount += 1;
      if (day.helpfulness === true) {
        weekdayStats[wday].helpfulCount += 1;
      }
    }
    if (day.self_score !== null) {
      weekdayStats[wday].selfScores.push(day.self_score);
    }
  });

  const hasData = feedback.by_day.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          夜の振り返り傾向
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
                  const feedbackRate =
                    stats.totalDays > 0
                      ? (stats.feedbackCount / stats.totalDays) * 100
                      : 0;
                  const helpfulRate =
                    stats.feedbackCount > 0
                      ? (stats.helpfulCount / stats.feedbackCount) * 100
                      : 0;
                  return (
                    <div
                      key={wday}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="text-xs font-medium mb-2">
                        {WEEKDAY_NAMES[Number(wday)]}曜日
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">フィードバック</span>
                          <span className="font-semibold">
                            {feedbackRate.toFixed(0)}%
                          </span>
                        </div>
                        {stats.feedbackCount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">役立った</span>
                            <span className="font-semibold">
                              {helpfulRate.toFixed(0)}%
                            </span>
                          </div>
                        )}
                        {stats.selfScores.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">セルフスコア</span>
                            <span className="font-semibold">
                              {(
                                stats.selfScores.reduce((a, b) => a + b, 0) /
                                stats.selfScores.length
                              ).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {!hasData && (
          <p className="text-sm text-gray-500 text-center py-4">
            今週はフィードバックがありませんでした
          </p>
        )}
      </CardContent>
    </Card>
  );
}

