"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Brain,
  Bed,
  Zap,
} from "lucide-react";
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
  level?: string | null;
  triggers?: Record<string, number | string>;
  reason_text?: string | null;
  evidence_text?: string | null;
}

interface SuggestionFeedbackCardProps {
  suggestion: Suggestion;
  helpfulness: boolean | null;
  onHelpfulnessChange: (value: boolean) => void;
}

// tagsによる色分け（ダッシュボードSuggestions.tsxと統一）
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

const getTagStyle = (tag: string) =>
  tagColorMap[tag as keyof typeof tagColorMap] || tagColorMap.default;

const getTagIcon = (tag: string) => {
  const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
  return <IconComponent className="w-3 h-3" />;
};

export function SuggestionFeedbackCard({
  suggestion,
  helpfulness,
  onHelpfulnessChange,
}: SuggestionFeedbackCardProps) {
  const levelStyle = getLevelStyle(suggestion.level);

  return (
    <article
      className={`flex flex-col gap-2 p-3 rounded border ${levelStyle.cardBgColor} ${levelStyle.borderColor}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-white min-w-0">
          {suggestion.title}
        </h4>
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

      <div className="space-y-2 pt-2 border-t">
        <Label className="text-sm">この提案は役立ちましたか？</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onHelpfulnessChange(true)}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
              helpfulness === true
                ? "border-green-500 bg-green-50 text-green-700 font-medium dark:border-green-600 dark:bg-green-950/50 dark:text-green-400"
                : "border-muted hover:border-green-300 dark:hover:border-green-800"
            }`}
          >
            👍 役立った
          </button>
          <button
            type="button"
            onClick={() => onHelpfulnessChange(false)}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
              helpfulness === false
                ? "border-red-500 bg-red-50 text-red-700 font-medium dark:border-red-600 dark:bg-red-950/50 dark:text-red-400"
                : "border-muted hover:border-red-300 dark:hover:border-red-800"
            }`}
          >
            👎 役立たなかった
          </button>
        </div>
      </div>
    </article>
  );
}
