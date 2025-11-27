"use client";

import Link from "next/link";
import { NotebookPen } from "lucide-react";
import Suggestions from "./Suggestions";
import { EveningReflectionDisplay } from "./EveningReflectionDisplay";
import { SignalsList } from "./SignalsList";
import { useEffect, useState } from "react";

type SignalEvent = {
  id: number;
  trigger_key: string;
  trigger_key_label?: string;
  category: string;
  level: string;
  priority: number;
  evaluated_at: string;
  meta?: Record<string, unknown> | null;
};

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
  bodySignals: Array<SignalEvent> | null;
  envSignals: Array<SignalEvent> | null;
}

export function AfterInputContent({
  dailyLog,
  suggestions,
  bodySignals,
  envSignals,
}: AfterInputContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizedBodySignals = Array.isArray(bodySignals) ? bodySignals : [];
  const normalizedEnvSignals = Array.isArray(envSignals) ? envSignals : [];
  const combinedSignals = [...normalizedEnvSignals, ...normalizedBodySignals];
  const hasSignalError = bodySignals === null || envSignals === null;

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
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          今日はこうした方がいいかも
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suggestions suggestions={suggestions} />
          <SignalsList
            signals={combinedSignals}
            hasError={hasSignalError}
            title="今日のシグナル"
          />
        </div>
        {/* 振り返り導線（時間帯に関係なく未実施の場合に表示） */}
        {/* mountedフラグでクライアント側でのみ表示 */}
        {mounted && !hasReflection && (
          <div className="flex justify-end mt-4">
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
