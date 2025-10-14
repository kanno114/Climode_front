"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  category: string;
}

type SeverityLevel = "high" | "medium" | "low";

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

interface SuggestionsProps {
  suggestions: Array<Suggestion>;
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  const getSeverityLevel = useCallback((severity: number): SeverityLevel => {
    if (severity >= 80) return "high";
    if (severity >= 50) return "medium";
    return "low";
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
    return <IconComponent className="w-3 h-3" />;
  }, []);

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            今日の行動提案
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>今日は特別な提案はありません</p>
            <p className="text-sm">体調が良好なようです！</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          今日の行動提案
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions
          .sort((a, b) => b.severity - a.severity)
          .map((suggestion) => {
            const severityLevel = getSeverityLevel(suggestion.severity);
            const severityStyle = severityConfig[severityLevel];

            return (
              <article
                key={suggestion.key}
                className={`p-3 rounded border ${severityStyle.cardBgColor} ${severityStyle.borderColor}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${severityStyle.color} ${severityStyle.bgColor}`}
                  >
                    {suggestion.severity}
                  </Badge>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  {suggestion.message}
                </p>

                <div className="flex flex-wrap gap-1">
                  {suggestion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <span className="flex items-center gap-1">
                        {getTagIcon(tag)}
                        {tag}
                      </span>
                    </Badge>
                  ))}
                </div>
              </article>
            );
          })}
      </CardContent>
    </Card>
  );
}
