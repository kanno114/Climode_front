"use client";

import { NotebookPen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuggestionFeedback {
  id: number;
  suggestion_key: string;
  helpfulness: boolean;
}

interface Suggestion {
  key: string;
  title: string;
}

interface EveningReflectionDisplayProps {
  note?: string | null;
  suggestion_feedbacks?: SuggestionFeedback[];
  suggestions?: Suggestion[];
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
    note || suggestion_feedbacks.length > 0 || helpfulness || match_score;

  if (!hasReflection) {
    return null; // 振り返り未実施の場合は何も表示しない（AfterInputContentで導線ボタンを表示）
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex items-center gap-3">
        <NotebookPen className="h-5 w-5 text-indigo-500" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            夜の振り返りを記録しました
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {note && <span>メモあり</span>}
        {suggestion_feedbacks.length > 0 && (
              <span>フィードバック {suggestion_feedbacks.length}件</span>
            )}
            {(helpfulness || match_score) && (
              <span>
                {helpfulness && `役立ち度: ${helpfulness}/5`}
                {helpfulness && match_score && " / "}
                {match_score && `的中度: ${match_score}/5`}
                  </span>
            )}
          </div>
            </div>
          </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/evening">詳細を見る</Link>
      </Button>
    </div>
  );
}
