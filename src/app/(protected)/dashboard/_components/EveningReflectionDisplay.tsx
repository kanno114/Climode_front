"use client";

import Link from "next/link";
import { NotebookPen } from "lucide-react";

interface EveningReflectionDisplayProps {
  note?: string | null;
  suggestion_feedbacks?: Array<{ id: number; suggestion_key: string; helpfulness: boolean }>;
  helpfulness?: number | null;
  match_score?: number | null;
}

export function EveningReflectionDisplay({
  note,
  suggestion_feedbacks = [],
  helpfulness,
  match_score,
}: EveningReflectionDisplayProps) {
  const hasReflection =
    !!note ||
    suggestion_feedbacks.length > 0 ||
    helpfulness != null ||
    match_score != null;

  if (!hasReflection) {
    return null;
  }

  return (
    <Link
      href="/evening"
      className="flex shrink-0 items-center justify-center gap-3 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 -m-2 p-2 text-center"
    >
      <NotebookPen className="h-5 w-5 shrink-0 text-indigo-500" />
      <p className="text-sm font-medium text-slate-900 dark:text-white text-center">
        振り返りを記録しました
      </p>
    </Link>
  );
}
