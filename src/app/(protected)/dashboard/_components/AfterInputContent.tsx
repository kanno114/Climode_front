"use client";

import Suggestions from "./Suggestions";

interface AfterInputContentProps {
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
  suggestions,
}: AfterInputContentProps) {
  return <Suggestions suggestions={suggestions} />;
}
