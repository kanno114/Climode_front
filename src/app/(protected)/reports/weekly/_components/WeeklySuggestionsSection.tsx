"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  const sortedDays = [...byDay].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const [dayIndex, setDayIndex] = useState(0);

  const getTagStyle = useCallback((tag: string) => {
    return tagColorMap[tag as keyof typeof tagColorMap] || tagColorMap.default;
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
    return <IconComponent className="w-3 h-3" />;
  }, []);

  if (sortedDays.length === 0) {
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

  const currentDay = sortedDays[dayIndex];
  const { date, items } = currentDay;

  return (
    <Card className="py-4 gap-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4" />
            提案
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={dayIndex === 0}
              onClick={() => setDayIndex((i) => i - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[5.5rem] text-center">
              {format(new Date(date), "M/d（E）", { locale: ja })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={dayIndex === sortedDays.length - 1}
              onClick={() => setDayIndex((i) => i + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {items.length}件
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => {
          const levelStyle = getLevelStyle(item.level);
          const primaryTag = (item.tags ?? [])[0];
          const PrimaryIcon = primaryTag
            ? (tagIconMap[primaryTag as keyof typeof tagIconMap] || Zap)
            : Zap;
          const primaryTagStyle = primaryTag
            ? getTagStyle(primaryTag)
            : tagColorMap.default;

          return (
            <article
              key={`${date}-${item.suggestion_key}`}
              className={`flex flex-col gap-2 p-3 rounded-lg border border-l-4 ${levelStyle.cardBgColor} ${levelStyle.borderColor} ${levelStyle.accentBorderColor}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <PrimaryIcon
                    className={`w-5 h-5 shrink-0 ${primaryTagStyle.color}`}
                  />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.helpfulness !== null && (
                    <span
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
                  {item.level && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${levelStyle.color} ${levelStyle.bgColor}`}
                    >
                      {getLevelLabel(item.level)}
                    </Badge>
                  )}
                </div>
              </div>
              {item.message && (
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {item.message}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
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
  );
}
