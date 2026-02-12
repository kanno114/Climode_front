"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getTimeOfDay,
  getTimeBasedMessage,
  type TimeOfDay,
} from "@/lib/time-based";

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
    <CardHeader>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {message.icon}
          <div>
            <CardTitle className="text-xl">{message.title}</CardTitle>
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
    </CardHeader>
  );
}
