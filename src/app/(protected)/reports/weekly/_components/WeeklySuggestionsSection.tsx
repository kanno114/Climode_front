"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Brain,
  Bed,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  getLevelLabel,
  getLevelStyle,
  getTagLabel,
} from "@/lib/suggestion-constants";
import type { WeeklyReportSuggestions } from "../types";

// tagsによる色分け（ダッシュボードSuggestions.tsxと統一）
const tagColorMap = {
  temperature: {
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  humidity: {
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-300",
  },
  pressure: {
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300",
  },
  sleep: {
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  mood: {
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
  },
  activity: {
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  health: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
  default: {
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
  },
} as const;

const tagIconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Wind,
  sleep: Bed,
  mood: Brain,
  activity: Activity,
  health: Heart,
} as const;

interface WeeklySuggestionsSectionProps {
  suggestions: WeeklyReportSuggestions | undefined;
}

export function WeeklySuggestionsSection({
  suggestions,
}: WeeklySuggestionsSectionProps) {
  const byDay = suggestions?.by_day ?? [];

  const getTagStyle = useCallback((tag: string) => {
    return tagColorMap[tag as keyof typeof tagColorMap] || tagColorMap.default;
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
    return <IconComponent className="w-3 h-3" />;
  }, []);

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
              {items.map((item) => {
                const levelStyle = getLevelStyle(item.level);
                return (
                  <article
                    key={`${date}-${item.suggestion_key}`}
                    className={`flex flex-col gap-2 p-3 rounded border ${levelStyle.cardBgColor} ${levelStyle.borderColor}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white min-w-0">
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
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {item.message}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 justify-end">
                      {item.level && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${levelStyle.color} ${levelStyle.bgColor}`}
                        >
                          {getLevelLabel(item.level)}
                        </Badge>
                      )}
                      {(item.tags ?? []).map((tag) => {
                        const tagStyle = getTagStyle(tag);
                        return (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-xs ${tagStyle.color} ${tagStyle.bgColor} ${tagStyle.borderColor}`}
                          >
                            <span className="flex items-center gap-1">
                              {getTagIcon(tag)}
                              {getTagLabel(tag)}
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
