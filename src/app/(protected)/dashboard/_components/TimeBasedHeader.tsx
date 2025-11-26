"use client";

import { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTimeOfDay,
  getTimeBasedMessage,
  type TimeOfDay,
} from "@/lib/time-based";

interface TimeBasedHeaderProps {
  hasDailyLog: boolean;
}

export function TimeBasedHeader({ hasDailyLog }: TimeBasedHeaderProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());

    // 時間帯が変わる可能性があるので、1時間ごとにチェック
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60 * 60 * 1000); // 1時間ごと

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    // サーバーとクライアントの時刻差を避けるため、初期レンダリング時は空を返す
    return null;
  }

  const message = getTimeBasedMessage(timeOfDay, hasDailyLog);

  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        {message.icon}
        <div>
          <CardTitle className="text-xl">{message.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {message.description}
          </p>
        </div>
      </div>
    </CardHeader>
  );
}
