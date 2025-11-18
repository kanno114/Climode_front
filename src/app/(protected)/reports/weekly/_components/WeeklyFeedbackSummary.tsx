import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { WeeklyReportFeedback } from "../types";

interface WeeklyFeedbackSummaryProps {
  feedback: WeeklyReportFeedback;
}

export function WeeklyFeedbackSummary({
  feedback,
}: WeeklyFeedbackSummaryProps) {
  const total = feedback.helpfulness_count.helpful + feedback.helpfulness_count.not_helpful;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>提案の評価</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週は提案の評価がありませんでした
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>提案の評価</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 役立ち度 */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            役立ち度
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  役立った
                </span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {feedback.helpfulness_rate !== null
                    ? `${feedback.helpfulness_rate}%`
                    : "-"}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${feedback.helpfulness_rate || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 件数内訳 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                役立った
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {feedback.helpfulness_count.helpful}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="h-5 w-5 text-red-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                役立たなかった
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {feedback.helpfulness_count.not_helpful}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

