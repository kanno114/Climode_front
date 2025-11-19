"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyLogData } from "../actions";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface WeeklyCalendarHeatmapProps {
  data: DailyLogData[];
}

export function WeeklyCalendarHeatmap({ data }: WeeklyCalendarHeatmapProps) {
  const router = useRouter();

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-200";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-green-400";
    if (score >= 40) return "bg-yellow-400";
    if (score >= 20) return "bg-orange-400";
    return "bg-red-400";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "記録なし";
    if (score >= 80) return "とても良い";
    if (score >= 60) return "良い";
    if (score >= 40) return "普通";
    if (score >= 20) return "やや悪い";
    return "悪い";
  };

  const handleDayClick = (log: DailyLogData) => {
    router.push(`/dailylog/${log.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">週間カレンダー</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((log) => (
            <div
              key={log.id}
              onClick={() => handleDayClick(log)}
              className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-500 transition-all cursor-pointer hover:shadow-md"
            >
              <div
                className={`w-16 h-16 rounded-lg ${getScoreColor(
                  log.score
                )} flex items-center justify-center shadow-sm`}
              >
                <span className="text-white font-bold text-xl">
                  {log.score ?? "-"}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {format(new Date(log.date), "M月d日 (EEEE)", { locale: ja })}
                </div>
                <div className="text-sm text-gray-600">
                  {getScoreLabel(log.score)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 凡例 */}
        <div className="mt-6 pt-4 border-t">
          <div className="text-sm font-medium text-gray-700 mb-2">
            体調スコア凡例
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">80-100: とても良い</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-xs text-gray-600">60-79: 良い</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-xs text-gray-600">40-59: 普通</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-xs text-gray-600">20-39: やや悪い</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-xs text-gray-600">0-19: 悪い</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
