"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { EditDailyLogForm } from "./EditDailyLogForm";
import { DailyLogScore } from "./DailyLogScore";
import { TodayDailyLog } from "./TodayDailyLog";

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
}

export function TodayArea({ dailyLog }: TodayAreaProps) {
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
              詳細表示
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EditDailyLogForm
            dailyLog={dailyLog}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DailyLogScore score={dailyLog.score} />
      <TodayDailyLog dailyLog={dailyLog} setIsEditing={setIsEditing} />
    </div>
  );
}
