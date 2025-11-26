"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Suggestions from "./Suggestions";
import { EveningReflectionDisplay } from "./EveningReflectionDisplay";
import { SignalsList } from "./SignalsList";
import { getTimeOfDay, type TimeOfDay } from "@/lib/time-based";
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
      {/* 振り返り導線（夕方以降で未実施の場合） */}
      {/* mountedフラグでクライアント側でのみ表示 */}
      {mounted &&
        !hasReflection &&
        (timeOfDay === "evening" || timeOfDay === "night") && (
          <div className="flex justify-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/evening">夜の振り返りに進む</Link>
            </Button>
          </div>
        )}
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
      </div>
    </>
  );
}
