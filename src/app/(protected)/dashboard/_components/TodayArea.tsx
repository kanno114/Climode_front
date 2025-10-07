"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { EditDailyLogForm } from "./EditDailyLogForm";
import { DailyLogScore } from "./DailyLogScore";
import { TodayDailyLog } from "./TodayDailyLog";
import Suggestions from "./Suggestions";

interface TodayAreaProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    memo?: string;
    score: number;
    prefecture?: {
      id: number;
      name_ja: string;
    };
    symptoms: Array<{
      id: number;
      name: string;
      code: string;
    }>;
    weather_observation?: {
      temperature_c: number;
      humidity_pct: number;
      pressure_hpa: number;
    };
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
  prefectures: Array<{ id: number; code: string; name_ja: string }>;
}

export function TodayArea({ dailyLog, suggestions, prefectures }: TodayAreaProps) {
  const [isEditing, setIsEditing] = useState(false);

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
        <DailyLogScore score={dailyLog.score} />
        <TodayDailyLog dailyLog={dailyLog} setIsEditing={setIsEditing} />
      </div>
      <div className="mt-4 w-full">
        <Suggestions suggestions={suggestions} />
      </div>
    </>
  );
}
