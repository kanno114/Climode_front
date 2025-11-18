"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuggestionFeedback {
  id: number;
  suggestion_key: string;
  helpfulness: boolean;
}

interface Suggestion {
  key: string;
  title: string;
}

interface EveningReflectionDisplayProps {
  note?: string | null;
  suggestion_feedbacks?: SuggestionFeedback[];
  suggestions?: Suggestion[];
  helpfulness?: number | null;
  match_score?: number | null;
}

export function EveningReflectionDisplay({
  note,
  suggestion_feedbacks = [],
  suggestions = [],
  helpfulness,
  match_score,
}: EveningReflectionDisplayProps) {
  const hasReflection = note || suggestion_feedbacks.length > 0 || helpfulness || match_score;

  // suggestion_keyからタイトルを取得する関数
  const getSuggestionTitle = (key: string): string => {
    const suggestion = suggestions.find((s) => s.key === key);
    return suggestion?.title || key;
  };

  if (!hasReflection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            夜の振り返り
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            まだ振り返りが記録されていません
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/evening">振り返りを記録する</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            夜の振り返り
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/evening">編集</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* メモ */}
        {note && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              メモ
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {note}
            </p>
          </div>
        )}

        {/* 提案フィードバック */}
        {suggestion_feedbacks.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              提案へのフィードバック
            </div>
            <div className="space-y-2">
              {suggestion_feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {getSuggestionTitle(feedback.suggestion_key)}
                  </span>
                  <Badge
                    variant={feedback.helpfulness ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {feedback.helpfulness ? (
                      <>
                        <ThumbsUp className="h-3 w-3" />
                        役立った
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-3 w-3" />
                        役立たなかった
                      </>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 全体評価 */}
        {(helpfulness || match_score) && (
          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm font-medium text-muted-foreground">
              全体評価
            </div>
            <div className="flex gap-4 text-sm">
              {helpfulness && (
                <div>
                  <span className="text-muted-foreground">役立ち度: </span>
                  <span className="font-medium">{helpfulness}/5</span>
                </div>
              )}
              {match_score && (
                <div>
                  <span className="text-muted-foreground">的中度: </span>
                  <span className="font-medium">{match_score}/5</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

