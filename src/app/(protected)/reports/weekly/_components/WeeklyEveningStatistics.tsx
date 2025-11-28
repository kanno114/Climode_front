"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { WeeklyReportFeedback } from "../types";

interface WeeklyEveningStatisticsProps {
  feedback: WeeklyReportFeedback;
}

export function WeeklyEveningStatistics({
  feedback,
}: WeeklyEveningStatisticsProps) {
  if (feedback.avg_self_score === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            夜の振り返り統計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週はセルフスコアの記録がありませんでした
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
          夜の振り返り統計
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* セルフスコア平均 */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            セルフスコア平均
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {feedback.avg_self_score.toFixed(1)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
