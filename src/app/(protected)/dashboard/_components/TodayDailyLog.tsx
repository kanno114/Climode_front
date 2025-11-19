"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Bed, Heart, Edit, Star } from "lucide-react";
import { SelfScoreDialog } from "./SelfScoreDialog";

interface TodayDailyLogProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    memo?: string;
    score: number;
    self_score?: number;
    prefecture?: {
      id: number;
      name_ja: string;
    };
  };
  setIsEditing: (isEditing: boolean) => void;
}

export function TodayDailyLog({ dailyLog, setIsEditing }: TodayDailyLogProps) {
  const moodScore = dailyLog.mood; // そのまま表示

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            今日の記録
          </CardTitle>
          <div className="flex items-center gap-2">
            <SelfScoreDialog dailyLog={dailyLog} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">睡眠時間</span>
            <span className="text-sm">{dailyLog.sleep_hours}時間</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">気分スコア</span>
            <span className="text-sm">{moodScore}</span>
          </div>
        </div>

        {dailyLog.self_score && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">セルフスコア</span>
            <span className="text-sm">{dailyLog.self_score}</span>
          </div>
        )}

        {/* メモ */}
        {dailyLog.memo && (
          <div className="space-y-2">
            <span className="text-sm font-medium">メモ</span>
            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              {dailyLog.memo}
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
