"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Bed, Heart, Zap } from "lucide-react";
import { submitMorningDeclaration } from "@/app/(protected)/morning/actions";
import { morningDeclarationSchema } from "@/lib/schemas/morning-declaration";

export function MorningDeclarationForm() {
  const [lastResult, action, pending] = useActionState(
    submitMorningDeclaration,
    undefined
  );
  const [sleepHours, setSleepHours] = useState<number[]>([6]);
  const [mood, setMood] = useState<number>(3);
  const [fatigue, setFatigue] = useState<number>(3);

  // バックエンドエラーをtoastで表示
  useEffect(() => {
    if (lastResult?.status === "error") {
      toast.error(
        lastResult.error?.message || "朝の自己申告の保存に失敗しました。"
      );
    }
  }, [lastResult]);

  const [form, fields] = useForm({
    id: "morning-declaration-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: morningDeclarationSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      sleep_hours: "6",
      mood: "3",
      fatigue: "3",
    },
  });

  const moodOptions = [
    { value: 1, emoji: "😢", label: "とても悪い" },
    { value: 2, emoji: "😕", label: "悪い" },
    { value: 3, emoji: "😐", label: "普通" },
    { value: 4, emoji: "🙂", label: "良い" },
    { value: 5, emoji: "😊", label: "とても良い" },
  ];

  const fatigueOptions = [
    { value: 1, label: "とても低い" },
    { value: 2, label: "低い" },
    { value: 3, label: "普通" },
    { value: 4, label: "高い" },
    { value: 5, label: "とても高い" },
  ];

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
        onSubmit={form.onSubmit}
        action={action}
        noValidate
        className="space-y-6"
      >
        {/* 睡眠時間 */}
        <div className="space-y-2">
          <Label htmlFor="sleep_hours">
            <Bed className="inline mr-2 h-4 w-4" />
            睡眠時間（時間）
          </Label>
          <div className="space-y-4">
            <Slider
              value={sleepHours}
              onValueChange={setSleepHours}
              min={0}
              max={12}
              step={0.5}
              disabled={pending}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0時間</span>
              <span className="font-medium">{sleepHours[0]}時間</span>
              <span>12時間</span>
            </div>
          </div>
          <input
            type="hidden"
            name={fields.sleep_hours.name}
            value={sleepHours[0]}
          />
          {fields.sleep_hours.errors?.map((e) => (
            <p key={e} className="text-sm text-red-500">
              {e}
            </p>
          ))}
        </div>

        {/* 気分 */}
        <div className="space-y-2">
          <Label htmlFor="mood">
            <Heart className="inline mr-2 h-4 w-4" />
            気分（1〜5）
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value)}
                disabled={pending}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                  mood === option.value
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <span className="text-2xl mb-1">{option.emoji}</span>
                <span className="text-xs text-muted-foreground">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <input type="hidden" name={fields.mood.name} value={mood} />
          {fields.mood.errors?.map((e) => (
            <p key={e} className="text-sm text-red-500">
              {e}
            </p>
          ))}
        </div>

        {/* 疲労感 */}
        <div className="space-y-2">
          <Label htmlFor="fatigue">
            <Zap className="inline mr-2 h-4 w-4" />
            疲労感（1〜5）
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {fatigueOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFatigue(option.value)}
                disabled={pending}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                  fatigue === option.value
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <span className="text-sm font-medium mb-1">{option.value}</span>
                <span className="text-xs text-muted-foreground">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <input type="hidden" name={fields.fatigue.name} value={fatigue} />
          {fields.fatigue.errors?.map((e) => (
            <p key={e} className="text-sm text-red-500">
              {e}
            </p>
          ))}
        </div>

        {/* 送信ボタン */}
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              送信中...
            </>
          ) : (
            "今日のシグナルを見る"
          )}
        </Button>
      </form>
    </div>
  );
}
