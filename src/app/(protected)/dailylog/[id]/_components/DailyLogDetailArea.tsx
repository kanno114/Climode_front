"use client";

import { DailyLogDetail } from "./DailyLogDetail";

interface DailyLogDetailAreaProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    memo?: string;
    score: number;
    self_score?: number;
    prefecture?: {
      id: number;
      name_ja: string;
    };
    prefecture_id?: number;
  };
}

export function DailyLogDetailArea({ dailyLog }: DailyLogDetailAreaProps) {
  return <DailyLogDetail dailyLog={dailyLog} />;
}