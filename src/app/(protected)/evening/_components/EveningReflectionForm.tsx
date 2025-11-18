"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Zap, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  submitEveningReflection,
  getTodaySuggestions,
} from "@/app/(protected)/evening/actions";
import { eveningReflectionSchema } from "@/lib/schemas/evening-reflection";
import { SuggestionFeedbackCard } from "./SuggestionFeedbackCard";

type Suggestion = {
  key: string;
  title: string;
  message: string;
  tags: string[];
  severity: number;
  triggers: string[];
};

export function EveningReflectionForm() {
  const [lastResult, action, pending] = useActionState(
    submitEveningReflection,
    undefined
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

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const suggestionsData = await getTodaySuggestions();

        if (suggestionsData) {
          setSuggestions(suggestionsData);
          // 初期値は設定しない（nullのまま）
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
    value: boolean
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

    const suggestionFeedbacksArray = Object.entries(suggestionFeedbacks)
      .filter(
        ([, helpfulness]) => helpfulness !== null && helpfulness !== undefined
      )
      .map(([key, helpfulness]) => ({
        key,
        helpfulness,
      }));
    formData.append(
      "suggestion_feedbacks",
      JSON.stringify(suggestionFeedbacksArray)
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
