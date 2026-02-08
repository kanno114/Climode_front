"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AlertTriangle, ActivitySquare, Sun, Thermometer } from "lucide-react";
import { extractMetaText, formatObservedValue } from "@/lib/signal-format";

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

interface SignalsListProps {
  signals: Array<SignalEvent>;
  hasError: boolean;
  title?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptySubMessage?: string;
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

export function SignalsList({
  signals,
  hasError,
  title = "今日のシグナル",
  emptyTitle = "今日のシグナル",
  emptyMessage = "今日は特に注意する点はありません ☀️",
  emptySubMessage = "穏やかなコンディションで過ごせそうです。",
}: SignalsListProps) {
  const canHover = useMediaQuery("(hover: hover)");

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
            {emptyTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-6 space-y-2">
          <Sun className="h-8 w-8 mx-auto text-amber-400" />
          <p>{emptyMessage}</p>
          <p>{emptySubMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-slate-600" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          ホバーまたはタップで詳細を表示
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {signals.map((signal) => {
          const IconComponent =
            categoryIconMap[signal.category] || ActivitySquare;
          const style = levelStyles[signal.level] || levelStyles.default;
          const metaText = extractMetaText(signal.meta);
          const observedValue = formatObservedValue(signal.meta);

          const trigger = (
            <article
              className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${style.container}`}
              title={canHover ? "ホバーで詳細を表示" : "タップで詳細を表示"}
            >
              <IconComponent className="h-4 w-4 shrink-0 text-slate-600" />
              <p className="font-medium text-slate-900 dark:text-white truncate min-w-0">
                {signal.trigger_key_label || signal.trigger_key}
              </p>
              <Badge
                className={`shrink-0 border ${style.badge}`}
              >
                {style.label}
              </Badge>
            </article>
          );

          const detailContent = (
            <div className="space-y-2">
              {observedValue && (
                <div className="p-2 bg-white/60 dark:bg-slate-800/60 rounded text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {observedValue}
                  </p>
                </div>
              )}
              {metaText && (
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {metaText}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {signal.category === "env" ? "環境" : "体調"} · 優先度{" "}
                {signal.priority}
              </p>
            </div>
          );

          return canHover ? (
            <HoverCard
              key={`${signal.id}-${signal.trigger_key}`}
              openDelay={300}
              closeDelay={100}
            >
              <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
              <HoverCardContent className="w-80" side="top" align="start">
                {detailContent}
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Popover key={`${signal.id}-${signal.trigger_key}`}>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
              <PopoverContent className="w-80" side="top" align="start">
                {detailContent}
              </PopoverContent>
            </Popover>
          );
        })}
      </CardContent>
    </Card>
  );
}
