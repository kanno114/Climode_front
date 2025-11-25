"use client";

import Suggestions from "./Suggestions";
import { EveningReflectionDisplay } from "./EveningReflectionDisplay";
import { SignalsList } from "./SignalsList";

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

interface TodayAreaProps {
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
  }> | null;
  bodySignals: Array<SignalEvent> | null;
  envSignals: Array<SignalEvent> | null;
}

export function TodayArea({
  dailyLog,
  suggestions,
  bodySignals,
  envSignals,
}: TodayAreaProps) {
  const normalizedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const normalizedBodySignals = Array.isArray(bodySignals) ? bodySignals : [];
  const normalizedEnvSignals = Array.isArray(envSignals) ? envSignals : [];
  const combinedSignals = [...normalizedEnvSignals, ...normalizedBodySignals];
  const hasSignalError = bodySignals === null || envSignals === null;

  return (
    <>
      {/* 体調シグナルと提案 */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          今日はこうした方がいいかも
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suggestions suggestions={normalizedSuggestions} />
          <SignalsList
            signals={combinedSignals}
            hasError={hasSignalError}
            title="今日のシグナル"
          />
      </div>
      </div>
      <div className="mt-6">
        <EveningReflectionDisplay
          note={dailyLog.note}
          suggestion_feedbacks={dailyLog.suggestion_feedbacks}
          suggestions={normalizedSuggestions}
          helpfulness={dailyLog.helpfulness}
          match_score={dailyLog.match_score}
        />
      </div>
    </>
  );
}
