"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen, Sun, Moon, Sunset, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getTimeOfDay,
  getTimeBasedMessage,
  type TimeOfDay,
  type TimeIconName,
} from "@/lib/time-based";

const TIME_ICON_COMPONENTS: Record<TimeIconName, ReactNode> = {
  sunrise: <Sunrise className="h-6 w-6 text-amber-500" />,
  sun: <Sun className="h-6 w-6 text-yellow-500" />,
  sunset: <Sunset className="h-6 w-6 text-orange-500" />,
  moon: <Moon className="h-6 w-6 text-indigo-500" />,
};

interface TimeBasedHeaderProps {
  hasDailyLog: boolean;
  hasReflection?: boolean;
  reflectionSlot?: ReactNode;
}

export function TimeBasedHeader({
  hasDailyLog,
  hasReflection = false,
  reflectionSlot,
}: TimeBasedHeaderProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());

    // 時間帯が変わる可能性があるので、1時間ごとにチェック
    const interval = setInterval(
      () => {
        setTimeOfDay(getTimeOfDay());
      },
      60 * 60 * 1000,
    ); // 1時間ごと

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // サーバーとクライアントの時刻差を避けるため、初期レンダリング時は空を返す
    return null;
  }

  const message = getTimeBasedMessage(timeOfDay, hasDailyLog, hasReflection);
  const isEveningOrNight = timeOfDay === "evening" || timeOfDay === "night";
  const showReflectionLinkInHeader =
    hasDailyLog && !hasReflection && isEveningOrNight;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {TIME_ICON_COMPONENTS[message.iconName]}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {message.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {message.description}
          </p>
        </div>
      </div>
      {reflectionSlot}
      {!reflectionSlot && showReflectionLinkInHeader && (
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/evening" className="flex items-center gap-2">
            <NotebookPen className="h-4 w-4" />
            1日を振り返る
          </Link>
        </Button>
      )}
    </div>
  );
}
