"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bed, Heart, MapPin, Star } from "lucide-react";

interface DailyLogDetailProps {
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

export function DailyLogDetail({ dailyLog }: DailyLogDetailProps) {
  const moodScore = dailyLog.mood;
  const symptomNames = dailyLog.symptoms.map((s) => s.name);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            今日の記録
          </CardTitle>
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

        {/* 症状 */}
        {symptomNames.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">症状</span>
            <div className="flex flex-wrap gap-1">
              {symptomNames.map((symptom, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {symptom}
                </Badge>
              ))}
            </div>
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

        {/* 天候情報 */}
        {dailyLog.weather_observation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">天候情報</span>
              {dailyLog.prefecture && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{dailyLog.prefecture.name_ja}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-muted/50 p-2 rounded">
                <div className="font-medium">気温</div>
                <div>{dailyLog.weather_observation.temperature_c}℃</div>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="font-medium">湿度</div>
                <div>{dailyLog.weather_observation.humidity_pct}%</div>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="font-medium">気圧</div>
                <div>{dailyLog.weather_observation.pressure_hpa}hPa</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
