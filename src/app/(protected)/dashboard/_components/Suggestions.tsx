"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Brain,
  Coffee,
  Bed,
  Zap,
  CircleHelp,
} from "lucide-react";
import { SuggestionEvidence } from "./SuggestionEvidence";
import {
  getLevelLabel,
  getLevelStyle,
  getTagLabel,
} from "@/lib/suggestion-constants";

interface Suggestion {
  key: string;
  title: string;
  message: string;
  tags: string[];
  severity: number;
  triggers?: Record<string, number | string>;
  category: string;
  level?: string | null;
  reason_text?: string | null;
  evidence_text?: string | null;
}

// tagsによる色分け（Badge用）
const tagColorMap = {
  temperature: {
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  humidity: {
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
    borderColor: "border-cyan-300",
  },
  pressure: {
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-300",
  },
  sleep: {
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  mood: {
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
  },
  activity: {
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  health: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
  default: {
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
  },
} as const;

const tagIconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Wind,
  sleep: Bed,
  mood: Brain,
  activity: Activity,
  health: Heart,
} as const;

interface SuggestionsProps {
  suggestions: Array<Suggestion>;
  title?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function Suggestions({
  suggestions,
  title = "今日の行動提案",
  emptyTitle = "今日の行動提案",
  emptyMessage = "今日は特別な提案はありません",
}: SuggestionsProps) {
  const canHover = useMediaQuery("(hover: hover)");

  const getTagStyle = useCallback((tag: string) => {
    return tagColorMap[tag as keyof typeof tagColorMap] || tagColorMap.default;
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
    return <IconComponent className="w-3 h-3" />;
  }, []);

  const renderDetailContent = useCallback((suggestion: Suggestion) => {
    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">
            {suggestion.title}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {suggestion.message}
          </p>
        </div>
        <SuggestionEvidence
          triggers={suggestion.triggers}
          reason_text={suggestion.reason_text}
          evidence_text={suggestion.evidence_text}
        />
      </div>
    );
  }, []);

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-5 h-5" />
            {emptyTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-500">
            <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>{emptyMessage}</p>
            <p className="text-sm">体調が良好なようです！</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4 gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="w-5 h-5" />
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            （{suggestions.length}件）
          </span>
        </CardTitle>
        {canHover && (
          <p className="text-xs text-muted-foreground mt-1 text-right">
            ?ボタンで判定の根拠を表示
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2 max-h-[min(50vh,24rem)] overflow-y-auto">
        {suggestions
          .sort((a, b) => b.severity - a.severity)
          .map((suggestion) => {
            const levelStyle = getLevelStyle(suggestion.level);
            const evidenceTrigger = (
              <button
                type="button"
                className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="判定の根拠を表示"
                title={
                  canHover
                    ? "ホバーで判定の根拠・参照元を表示"
                    : "クリックで判定の根拠・参照元を表示"
                }
              >
                <CircleHelp className="h-5 w-5 text-muted-foreground" />
              </button>
            );

            return (
              <article
                key={suggestion.key}
                className={`flex flex-col gap-2 p-3 rounded border ${levelStyle.cardBgColor} ${levelStyle.borderColor}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white min-w-0">
                    {suggestion.title}
                  </h4>
                  <div className="flex items-center gap-1 shrink-0">
                    {canHover ? (
                      <HoverCard openDelay={300} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          {evidenceTrigger}
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-96 max-h-[min(80vh,28rem)] overflow-y-auto p-4"
                          side="top"
                          align="end"
                        >
                          {renderDetailContent(suggestion)}
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          {evidenceTrigger}
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-96 max-h-[min(80vh,28rem)] overflow-y-auto p-4"
                          side="top"
                          align="end"
                        >
                          {renderDetailContent(suggestion)}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {suggestion.message}
                </p>
                <div className="flex flex-wrap gap-1 justify-end">
                  {suggestion.level && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${levelStyle.color} ${levelStyle.bgColor}`}
                    >
                      {getLevelLabel(suggestion.level)}
                    </Badge>
                  )}
                  {suggestion.tags.map((tag) => {
                    const tagStyle = getTagStyle(tag);
                    return (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-xs ${tagStyle.color} ${tagStyle.bgColor} ${tagStyle.borderColor}`}
                      >
                        <span className="flex items-center gap-1">
                          {getTagIcon(tag)}
                          {getTagLabel(tag)}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </article>
            );
          })}
      </CardContent>
    </Card>
  );
}
