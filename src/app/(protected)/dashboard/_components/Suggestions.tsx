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

// categoryによる色分け
const categoryConfig = {
  env: {
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    cardBgColor: "bg-blue-50",
  },
  body: {
    color: "text-pink-700",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
    cardBgColor: "bg-pink-50",
  },
  default: {
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    cardBgColor: "bg-gray-50",
  },
} as const;

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
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
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

  const getCategoryStyle = useCallback((category: string) => {
    return (
      categoryConfig[category as keyof typeof categoryConfig] ||
      categoryConfig.default
    );
  }, []);

  const getTagStyle = useCallback((tag: string) => {
    return tagColorMap[tag as keyof typeof tagColorMap] || tagColorMap.default;
  }, []);

  const getTagIcon = useCallback((tag: string) => {
    const IconComponent = tagIconMap[tag as keyof typeof tagIconMap] || Zap;
    return <IconComponent className="w-3 h-3" />;
  }, []);

  const renderDetailContent = useCallback(
    (suggestion: Suggestion) => (
      <>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {suggestion.message}
        </p>
        {suggestion.tags.length > 0 && (
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
                    {tag}
                  </span>
                </Badge>
              );
            })}
          </div>
        )}
      </>
    ),
    [getTagStyle, getTagIcon]
  );

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {emptyTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
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
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          ホバーまたはタップで詳細を表示
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions
          .sort((a, b) => b.severity - a.severity)
          .map((suggestion) => {
            const categoryStyle = getCategoryStyle(suggestion.category);
            const trigger = (
              <article
                className={`flex items-center justify-between gap-2 p-2 rounded border cursor-pointer ${categoryStyle.cardBgColor} ${categoryStyle.borderColor}`}
                title={canHover ? "ホバーで詳細を表示" : "タップで詳細を表示"}
              >
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate min-w-0">
                  {suggestion.title}
                </h4>
                <Badge
                  variant="secondary"
                  className={`text-xs shrink-0 ${categoryStyle.color} ${categoryStyle.bgColor}`}
                >
                  {suggestion.severity}
                </Badge>
              </article>
            );

            return canHover ? (
              <HoverCard key={suggestion.key} openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
                <HoverCardContent
                  className="w-80"
                  side="top"
                  align="start"
                >
                  {renderDetailContent(suggestion)}
                </HoverCardContent>
              </HoverCard>
            ) : (
              <Popover key={suggestion.key}>
                <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                <PopoverContent
                  className="w-80"
                  side="top"
                  align="start"
                >
                  {renderDetailContent(suggestion)}
                </PopoverContent>
              </Popover>
            );
          })}
      </CardContent>
    </Card>
  );
}
