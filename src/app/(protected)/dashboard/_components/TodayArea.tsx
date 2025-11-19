"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { EditDailyLogForm } from "./EditDailyLogForm";
import { DailyLogScore } from "./DailyLogScore";
import { TodayDailyLog } from "./TodayDailyLog";
import Suggestions from "./Suggestions";
import { SignalsList } from "./SignalsList";
import { EveningReflectionDisplay } from "./EveningReflectionDisplay";

type SignalEvent = {
  id: number;
  trigger_key: string;
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
  signals: Array<SignalEvent> | null;
  prefectures: Array<{ id: number; code: string; name_ja: string }>;
}

export function TodayArea({
  dailyLog,
  suggestions,
  signals,
  prefectures,
}: TodayAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const normalizedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const normalizedSignals = Array.isArray(signals) ? signals : [];
  const hasSignalError = signals === null;

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              記録を編集
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <Eye className="h-4 w-4 mr-2" />
              表示
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EditDailyLogForm
            dailyLog={dailyLog}
            onCancel={() => setIsEditing(false)}
            prefectures={prefectures}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyLogScore score={dailyLog.score} date={dailyLog.date} />
        <TodayDailyLog dailyLog={dailyLog} setIsEditing={setIsEditing} />
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignalsList signals={normalizedSignals} hasError={hasSignalError} />
        <Suggestions suggestions={normalizedSuggestions} />
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
