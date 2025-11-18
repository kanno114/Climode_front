"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ActivitySquare, Sun, Thermometer } from "lucide-react";

type SignalEvent = {
  id: number;
  trigger_key: string;
  category: string;
  level: string;
  priority: number;
  evaluated_at: string;
  meta?: Record<string, unknown> | null;
};

interface SignalsListProps {
  signals: Array<SignalEvent>;
  hasError: boolean;
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

const extractMetaText = (meta?: Record<string, unknown> | null) => {
  if (!meta) return null;
  if (typeof meta.comment === "string") return meta.comment;
  if (typeof meta.summary === "string") return meta.summary;
  return null;
};

export function SignalsList({ signals, hasError }: SignalsListProps) {
  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            今日のシグナル
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>シグナルを取得できませんでした</AlertTitle>
            <AlertDescription>
              ネットワーク環境を確認し、再読み込みしてください。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!signals.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            今日のシグナル
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-6 space-y-2">
          <Sun className="h-8 w-8 mx-auto text-amber-400" />
          <p>今日は特に注意する点はありません ☀️</p>
          <p>穏やかなコンディションで過ごせそうです。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-slate-600" />
          今日のシグナル
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {signals.map((signal) => {
          const IconComponent =
            categoryIconMap[signal.category] || ActivitySquare;
          const style = levelStyles[signal.level] || levelStyles.default;
          const metaText = extractMetaText(signal.meta);

          return (
            <article
              key={`${signal.id}-${signal.trigger_key}`}
              className={`rounded-lg border p-4 ${style.container}`}
            >
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
              {metaText ? (
                <p className="mt-3 text-sm text-slate-700">{metaText}</p>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                評価時刻:{" "}
                {new Date(signal.evaluated_at).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Tokyo",
                })}
              </p>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}
