"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ActivitySquare, Thermometer } from "lucide-react";

type SignalEvent = {
  id: number;
  trigger_key: string;
  category: string;
  level: string;
  priority: number;
  evaluated_at: string;
  meta?: Record<string, unknown> | null;
};

interface SignalFeedbackCardProps {
  signal: SignalEvent;
  match: number | null;
  onMatchChange: (value: number) => void;
}

const levelStyles: Record<
  string,
  {
    badge: string;
    container: string;
    label: string;
  }
> = {
  strong: {
    badge: "bg-red-100 text-red-700 border-red-200",
    container: "bg-red-50 border-red-200",
    label: "強い注意",
  },
  warning: {
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    container: "bg-orange-50 border-orange-200",
    label: "警戒レベル",
  },
  attention: {
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    container: "bg-yellow-50 border-yellow-200",
    label: "注意レベル",
  },
  none: {
    badge: "bg-green-100 text-green-700 border-green-200",
    container: "bg-green-50 border-green-200",
    label: "良好",
  },
  default: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    container: "bg-slate-50 border-slate-200",
    label: "シグナル",
  },
};

const categoryIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  env: Thermometer,
  body: ActivitySquare,
};

const formatTriggerKey = (key: string) => {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export function SignalFeedbackCard({
  signal,
  match,
  onMatchChange,
}: SignalFeedbackCardProps) {
  const IconComponent = categoryIconMap[signal.category] || ActivitySquare;
  const style = levelStyles[signal.level] || levelStyles.default;
  const matchValue = match ?? 3;

  return (
    <Card className={`${style.container} border`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">トリガー</p>
            <p className="text-lg font-semibold">
              {formatTriggerKey(signal.trigger_key)}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <IconComponent className="h-3.5 w-3.5" />
              <span>{signal.category === "env" ? "環境" : "体調"}</span>
              <span>優先度 {signal.priority}</span>
            </div>
          </div>
          <Badge className={`${style.badge} border`}>{style.label}</Badge>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor={`signal-match-${signal.id}`} className="text-sm">
            的中度（1〜5）
          </Label>
          <div className="space-y-2">
            <Slider
              id={`signal-match-${signal.id}`}
              value={[matchValue]}
              onValueChange={(values) => onMatchChange(values[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1（低い）</span>
              <span className="font-medium">{matchValue} ⭐</span>
              <span>5（高い）</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
