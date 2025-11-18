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
  Coffee,
  Bed,
  Zap,
} from "lucide-react";

interface Suggestion {
  key: string;
  title: string;
  message: string;
  tags: string[];
  severity: number;
  triggers: string[];
}

interface SuggestionFeedbackCardProps {
  suggestion: Suggestion;
  helpfulness: boolean | null;
  onHelpfulnessChange: (value: boolean) => void;
}

const severityConfig = {
  high: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    cardBgColor: "bg-red-50",
  },
  medium: {
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    cardBgColor: "bg-yellow-50",
  },
  low: {
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    cardBgColor: "bg-green-50",
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

const getSeverityLevel = (severity: number): "high" | "medium" | "low" => {
  if (severity >= 80) return "high";
  if (severity >= 50) return "medium";
  return "low";
};

const getTagIcon = (tag: string) => {
  const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
  return <IconComponent className="w-3 h-3" />;
};

export function SuggestionFeedbackCard({
  suggestion,
  helpfulness,
  onHelpfulnessChange,
}: SuggestionFeedbackCardProps) {
  const severityLevel = getSeverityLevel(suggestion.severity);
  const severityStyle = severityConfig[severityLevel];

  return (
    <Card
      className={`${severityStyle.cardBgColor} ${severityStyle.borderColor} border`}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{suggestion.title}</h4>
          <Badge
            variant="secondary"
            className={`text-xs ${severityStyle.color} ${severityStyle.bgColor}`}
          >
            {suggestion.severity}
          </Badge>
        </div>

        <p className="text-sm text-gray-700 mb-2">{suggestion.message}</p>

        <div className="flex flex-wrap gap-1 mb-2">
          {suggestion.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <span className="flex items-center gap-1">
                {getTagIcon(tag)}
                {tag}
              </span>
            </Badge>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label className="text-sm">この提案は役立ちましたか？</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onHelpfulnessChange(true)}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                helpfulness === true
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              👍 役立った
            </button>
            <button
              type="button"
              onClick={() => onHelpfulnessChange(false)}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                helpfulness === false
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              👎 役立たなかった
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
