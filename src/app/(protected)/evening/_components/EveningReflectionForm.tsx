"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Zap, MessageSquare, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  submitEveningReflection,
  getTodaySuggestions,
  getTodayDailyLog,
} from "@/app/(protected)/evening/actions";
import { eveningReflectionSchema } from "@/lib/schemas/evening-reflection";
import { SuggestionFeedbackCard } from "./SuggestionFeedbackCard";

type Suggestion = {
  key: string;
  title: string;
  message: string;
  tags: string[];
  severity: number;
  level?: string | null;
  triggers?: Record<string, number | string>;
  reason_text?: string | null;
  evidence_text?: string | null;
};

export function EveningReflectionForm() {
  const [lastResult, action, pending] = useActionState(
    submitEveningReflection,
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィードバック状態
  const [suggestionFeedbacks, setSuggestionFeedbacks] = useState<
    Record<string, boolean>
  >({});
  const [note, setNote] = useState("");
  const [selfScore, setSelfScore] = useState<number | null>(null);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 提案データと既存の振り返りデータを並列取得
        const [suggestionsData, dailyLogData] = await Promise.all([
          getTodaySuggestions(),
          getTodayDailyLog(),
        ]);

        if (suggestionsData) {
          setSuggestions(suggestionsData);
        }

        // 既存の振り返りデータがあればフォームに反映
        if (dailyLogData) {
          // メモを設定
          if (dailyLogData.note) {
            setNote(dailyLogData.note);
          }

          // セルフスコアを設定
          if (
            dailyLogData.self_score !== null &&
            dailyLogData.self_score !== undefined
          ) {
            setSelfScore(dailyLogData.self_score);
          }

          // 提案フィードバックを設定
          if (
            dailyLogData.suggestion_feedbacks &&
            Array.isArray(dailyLogData.suggestion_feedbacks)
          ) {
            const feedbacksMap: Record<string, boolean> = {};
            dailyLogData.suggestion_feedbacks.forEach(
              (feedback: { suggestion_key: string; helpfulness: boolean }) => {
                if (
                  feedback.suggestion_key &&
                  feedback.helpfulness !== null &&
                  feedback.helpfulness !== undefined
                ) {
                  feedbacksMap[feedback.suggestion_key] = feedback.helpfulness;
                }
              },
            );
            setSuggestionFeedbacks(feedbacksMap);
          }
        }

        setError(null);
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // バックエンドエラーをtoastで表示
  useEffect(() => {
    if (lastResult) {
      console.log("lastResult:", lastResult);
      if (lastResult.status === "error") {
        const errorMessage =
          lastResult.error?.message ||
          lastResult.error?.formErrors?.[0] ||
          "夜の振り返りの保存に失敗しました。";
        toast.error(errorMessage);
      }
    }
  }, [lastResult]);

  const [form] = useForm({
    id: "evening-reflection-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eveningReflectionSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleSuggestionHelpfulnessChange = (
    suggestionKey: string,
    value: boolean,
  ) => {
    setSuggestionFeedbacks((prev) => ({
      ...prev,
      [suggestionKey]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 重複送信を防ぐ
    if (pending || isPending) {
      return;
    }

    const formData = new FormData();
    formData.append("note", note);
    if (selfScore !== null) {
      formData.append("self_score", selfScore.toString());
    }

    const suggestionFeedbacksArray = Object.entries(suggestionFeedbacks)
      .filter(
        ([, helpfulness]) => helpfulness !== null && helpfulness !== undefined,
      )
      .map(([key, helpfulness]) => ({
        key,
        helpfulness,
      }));
    formData.append(
      "suggestion_feedbacks",
      JSON.stringify(suggestionFeedbacksArray),
    );

    startTransition(() => {
      action(formData);
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">データを読み込んでいます...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {form.errors && form.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {form.errors.map((error: string, index: number) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <form
        id={form.id}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        {/* セクションA: 今日の提案 */}
        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                今日の提案
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion) => (
                <SuggestionFeedbackCard
                  key={suggestion.key}
                  suggestion={suggestion}
                  helpfulness={suggestionFeedbacks[suggestion.key] ?? null}
                  onHelpfulnessChange={(value) =>
                    handleSuggestionHelpfulnessChange(suggestion.key, value)
                  }
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* セクションB: セルフスコア */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              今日の体調はどうでしたか？
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>セルフスコア</Label>
              <div className="flex gap-2">
                {/* 良い→普通→悪いの順で表示（色分け: 緑・黄・赤） */}
                {[3, 2, 1].map((score) => {
                  const isSelected = selfScore === score;
                  const scoreStyles = {
                    3: isSelected
                      ? "border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/50 dark:text-green-400"
                      : "hover:border-green-300 dark:hover:border-green-800",
                    2: isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                      : "hover:border-amber-300 dark:hover:border-amber-800",
                    1: isSelected
                      ? "border-red-500 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950/50 dark:text-red-400"
                      : "hover:border-red-300 dark:hover:border-red-800",
                  };
                  return (
                    <Button
                      key={score}
                      type="button"
                      variant="outline"
                      onClick={() => setSelfScore(score)}
                      className={`flex-1 border-2 ${scoreStyles[score as 1 | 2 | 3]}`}
                      disabled={pending || isPending}
                    >
                      {score === 1
                        ? "😕 悪い"
                        : score === 2
                          ? "😐 普通"
                          : "😊 良い"}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* セクションC: 出来事入力 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              出来事
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* メモ */}
            <div className="space-y-2">
              <Label htmlFor="note">自由記述メモ</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="今日の出来事や気づきを記録してください..."
                disabled={pending}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 送信ボタン */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={pending || isPending}
        >
          {pending || isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "保存してダッシュボードへ"
          )}
        </Button>
      </form>
    </div>
  );
}
