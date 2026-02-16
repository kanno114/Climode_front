"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, MapPin, Heart, Bell } from "lucide-react";

type CompletionScreenProps = {
  prefectureName: string | null;
  concernTopicsCount: number;
  notificationEnabled: boolean;
  onGoToDashboard: () => void;
};

export function CompletionScreen({
  prefectureName,
  concernTopicsCount,
  notificationEnabled,
  onGoToDashboard,
}: CompletionScreenProps) {
  const summaryItems = [
    {
      icon: MapPin,
      label: "取得地域",
      value: prefectureName ?? "未設定",
    },
    {
      icon: Heart,
      label: "関心トピック",
      value: `${concernTopicsCount}件登録`,
    },
    {
      icon: Bell,
      label: "通知",
      value: notificationEnabled ? "有効" : "スキップ",
    },
  ];

  return (
    <Card className="shadow-xl border-primary/10">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <CardTitle className="text-2xl">設定が完了しました！</CardTitle>
        <p className="text-muted-foreground mt-2">
          Climodeがあなたに合った提案をお届けする準備ができました。
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-medium ml-auto">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
        <Button className="w-full" size="lg" onClick={onGoToDashboard}>
          ダッシュボードへ
        </Button>
      </CardContent>
    </Card>
  );
}
