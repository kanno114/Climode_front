"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  const getTagStyle = useCallback((tag: string) => {
    return tagColorMap[tag as keyof typeof tagColorMap] || tagColorMap.default;
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
    return <IconComponent className="w-3 h-3" />;
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
    <>
      <Card className="py-4 gap-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-5 h-5" />
            {title}
            <span className="text-sm font-normal text-muted-foreground">
              （{suggestions.length}件）
            </span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            タップで詳細を表示
          </p>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[min(50vh,24rem)] overflow-y-auto">
          {suggestions
            .sort((a, b) => b.severity - a.severity)
            .map((suggestion) => {
              const levelStyle = getLevelStyle(suggestion.level);
              const primaryTag = suggestion.tags[0];
              const PrimaryIcon = primaryTag
                ? (tagIconMap[primaryTag as keyof typeof tagIconMap] || Zap)
                : Zap;
              const primaryTagStyle = primaryTag
                ? getTagStyle(primaryTag)
                : tagColorMap.default;

              return (
                <article
                  key={suggestion.key}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedSuggestion(suggestion)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedSuggestion(suggestion);
                    }
                  }}
                  className={`flex flex-col gap-2 p-3 rounded-lg border border-l-4 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${levelStyle.cardBgColor} ${levelStyle.borderColor} ${levelStyle.accentBorderColor}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <PrimaryIcon
                        className={`w-5 h-5 shrink-0 ${primaryTagStyle.color}`}
                      />
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {suggestion.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {suggestion.level && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${levelStyle.color} ${levelStyle.bgColor}`}
                        >
                          {getLevelLabel(suggestion.level)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {suggestion.message}
                  </p>
                  <div className="flex flex-wrap gap-1">
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

      <Dialog
        open={selectedSuggestion !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSuggestion(null);
        }}
      >
        {selectedSuggestion && (
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedSuggestion.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {selectedSuggestion.message}
            </p>
            <SuggestionEvidence
              triggers={selectedSuggestion.triggers}
              reason_text={selectedSuggestion.reason_text}
              evidence_text={selectedSuggestion.evidence_text}
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
