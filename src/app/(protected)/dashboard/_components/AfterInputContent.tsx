"use client";

import Suggestions from "./Suggestions";

interface AfterInputContentProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    memo?: string;
    note?: string | null;
    score: number;
    helpfulness?: number | null;
    match_score?: number | null;
    prefecture?: {
      id: number;
      name_ja: string;
    };
    suggestion_feedbacks?: Array<{
      id: number;
      suggestion_key: string;
      helpfulness: boolean;
    }>;
  };
  suggestions: Array<{
    key: string;
    title: string;
    message: string;
    tags: Array<string>;
    severity: number;
    level?: string | null;
    triggers?: Record<string, number | string>;
    category: string;
    reason_text?: string | null;
    evidence_text?: string | null;
  }>;
}

export function AfterInputContent({
  dailyLog,
  suggestions,
}: AfterInputContentProps) {
  return (
    <div>
      <Suggestions suggestions={suggestions} />
    </div>
  );
}
