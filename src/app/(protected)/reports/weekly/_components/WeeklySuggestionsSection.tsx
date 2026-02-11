"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { WeeklyReportSuggestions } from "../types";

interface WeeklySuggestionsSectionProps {
  suggestions: WeeklyReportSuggestions | undefined;
}

export function WeeklySuggestionsSection({
  suggestions,
}: WeeklySuggestionsSectionProps) {
  const byDay = suggestions?.by_day ?? [];

  if (byDay.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            提案
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週は提案の記録がありません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
        <Lightbulb className="h-5 w-5" />
        提案
      </h3>

      <div className="space-y-6">
        {byDay.map(({ date, items }) => (
          <Card key={date}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {format(new Date(date), "M月d日（E）", { locale: ja })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${date}-${item.suggestion_key}`}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {item.title}
                    </h4>
                    {item.helpfulness !== null && (
                      <span
                        className="shrink-0 flex items-center gap-1 text-sm"
                        title={
                          item.helpfulness
                            ? "参考になった"
                            : "参考にならなかった"
                        }
                      >
                        {item.helpfulness ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {item.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.message}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
