"use client";

import Link from "next/link";
import { NotebookPen } from "lucide-react";
import Suggestions from "./Suggestions";
import { EveningReflectionDisplay } from "./EveningReflectionDisplay";
import { useEffect, useState } from "react";

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
    triggers: Array<string>;
    category: string;
  }>;
}

export function AfterInputContent({
  dailyLog,
  suggestions,
}: AfterInputContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasReflection =
    !!dailyLog.note ||
    (dailyLog.suggestion_feedbacks?.length ?? 0) > 0 ||
    !!dailyLog.helpfulness ||
    !!dailyLog.match_score;

  return (
    <>
      {/* 夜の振り返り表示（振り返り済みの場合のみ） */}
      {hasReflection && (
        <EveningReflectionDisplay
          note={dailyLog.note}
          suggestion_feedbacks={dailyLog.suggestion_feedbacks}
          suggestions={suggestions}
          helpfulness={dailyLog.helpfulness}
          match_score={dailyLog.match_score}
        />
      )}
      {/* 体調シグナルと提案 */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          今日はこうした方がいいかも
        </h2>
        <Suggestions suggestions={suggestions} />
        {/* 振り返り導線（時間帯に関係なく未実施の場合に表示） */}
        {/* mountedフラグでクライアント側でのみ表示 */}
        {mounted && !hasReflection && (
          <div className="flex justify-end mt-2">
            <Link
              href="/evening"
              className="flex items-center gap-2 text-base text-gray-700 dark:text-gray-300 font-medium underline underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <NotebookPen className="h-4 w-4" />
              夜の振り返りを書く
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
