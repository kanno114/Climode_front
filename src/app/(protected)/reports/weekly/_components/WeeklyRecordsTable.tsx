"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "lucide-react";
import type { WeeklyReportDaily, WeeklyReportFeedback } from "../types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface WeeklyRecordsTableProps {
  daily: WeeklyReportDaily;
  feedback: WeeklyReportFeedback;
}

export function WeeklyRecordsTable({
  daily,
  feedback,
}: WeeklyRecordsTableProps) {
  const sortedDays = [...daily.by_day].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const selfScoreMap = new Map<string, number | null>();
  const helpfulnessMap = new Map<string, boolean | null>();
  feedback.by_day.forEach((day) => {
    selfScoreMap.set(day.date, day.self_score);
    helpfulnessMap.set(day.date, day.helpfulness);
  });

  if (sortedDays.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table className="h-5 w-5" />
          日別データ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-3 font-medium text-gray-500 dark:text-gray-400">
                  日付
                </th>
                <th className="pb-2 px-3 font-medium text-blue-600 dark:text-blue-400 text-right">
                  睡眠
                </th>
                <th className="pb-2 px-3 font-medium text-pink-600 dark:text-pink-400 text-right">
                  気分
                </th>
                <th className="pb-2 px-3 font-medium text-orange-600 dark:text-orange-400 text-right">
                  疲労
                </th>
                <th className="pb-2 pl-3 font-medium text-purple-600 dark:text-purple-400 text-right">
                  スコア
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDays.map((day) => {
                const selfScore = selfScoreMap.get(day.date);
                return (
                  <tr
                    key={day.date}
                    className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-2.5 pr-3 text-gray-700 dark:text-gray-300">
                      {format(new Date(day.date), "M/d（E）", { locale: ja })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {day.sleep_hours != null ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          {day.sleep_hours}h
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {day.mood != null ? (
                        <span className="text-pink-600 dark:text-pink-400">
                          {day.mood}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {day.fatigue_level != null ? (
                        <span className="text-orange-600 dark:text-orange-400">
                          {day.fatigue_level}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 pl-3 text-right tabular-nums">
                      {selfScore != null ? (
                        <span className="text-purple-600 dark:text-purple-400">
                          {selfScore}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
