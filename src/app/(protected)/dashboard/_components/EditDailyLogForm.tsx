"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CalendarIcon, Bed, Heart, X, MapPin } from "lucide-react";
import { updateDailyLogAction, getPrefectures } from "../actions";
import { dailyLogSchema } from "@/lib/schemas/daily-log";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { SYMPTOM_NAMES, symptomNamesToCodes } from "@/lib/symptoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { join } from "path/posix";

interface EditDailyLogFormProps {
  dailyLog: {
    id: number;
    date: string;
    sleep_hours: number;
    mood: number;
    memo?: string;
    prefecture_id?: number;
    symptoms: Array<{
      id: number;
      name: string;
      code: string;
    }>;
  };
  onCancel: () => void;
}

export function EditDailyLogForm({
  dailyLog,
  onCancel,
}: EditDailyLogFormProps) {
  const [lastResult, action, pending] = useActionState(
    updateDailyLogAction,
    undefined
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    dailyLog.symptoms.map((s) => s.name)
  );
  const [prefectures, setPrefectures] = useState<
    Array<{ id: number; code: string; name_ja: string }>
  >([]);
  const [sleepHours, setSleepHours] = useState<number[]>([
    dailyLog.sleep_hours,
  ]);
  const [moodScore, setMoodScore] = useState<number[]>([dailyLog.mood]);

  // 都道府県データを取得
  useEffect(() => {
    const fetchPrefectures = async () => {
      const data = await getPrefectures();
      if (data) {
        setPrefectures(data);
      }
    };
    fetchPrefectures();
  }, []);

  // バックエンドエラーをtoastで表示
  useEffect(() => {
    if (lastResult?.status === "error") {
      toast.error(lastResult.error?.message || "記録の更新に失敗しました。");
    }
  }, [lastResult]);

  const [form, fields] = useForm({
    id: "edit-daily-log-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: dailyLogSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      date: dailyLog.date,
      prefecture_id: dailyLog.prefecture_id?.toString() || "",
      sleep_hours: dailyLog.sleep_hours.toString(),
      mood_score: dailyLog.mood.toString(), // そのまま使用
      notes: dailyLog.memo || "",
    },
  });

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    } else {
      setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom));
    }
  };

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
        {/* 日付表示（編集不可） */}
        <div className="space-y-2">
          <Label htmlFor="date">日付</Label>
          <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(new Date(dailyLog.date), "yyyy年MM月dd日", {
                locale: ja,
              })}
            </span>
          </div>
          <input type="hidden" name={fields.date.name} value={dailyLog.date} />
        </div>

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

        {/* 気分スコア */}
        <div className="space-y-2">
          <Label htmlFor="mood_score">
            <Heart className="inline mr-2 h-4 w-4" />
            気分スコア（-5〜5）
          </Label>
          <div className="space-y-4">
            <Slider
              value={moodScore}
              onValueChange={setMoodScore}
              min={-5}
              max={5}
              step={1}
              disabled={pending}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>😢 -5</span>
              <span className="font-medium">{moodScore[0]}</span>
              <span>😊 5</span>
            </div>
          </div>
          <input
            type="hidden"
            name={fields.mood_score.name}
            value={moodScore[0]}
          />
          {fields.mood_score.errors?.map((e) => (
            <p key={e} className="text-sm text-red-500">
              {e}
            </p>
          ))}
        </div>

        {/* 症状選択 */}
        <div className="space-y-2">
          <Label>症状（複数選択可）</Label>
          <div className="grid grid-cols-2 gap-2">
            {SYMPTOM_NAMES.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={`edit-${symptom}`}
                  checked={selectedSymptoms.includes(symptom)}
                  onCheckedChange={(checked) =>
                    handleSymptomChange(symptom, checked as boolean)
                  }
                  disabled={pending}
                />
                <Label htmlFor={`edit-${symptom}`} className="text-sm">
                  {symptom}
                </Label>
              </div>
            ))}
          </div>
          <input
            type="hidden"
            name={fields.symptoms?.name || "symptoms"}
            value={JSON.stringify(symptomNamesToCodes(selectedSymptoms))}
          />
        </div>

        {/* メモ */}
        <div className="space-y-2">
          <Label htmlFor="notes">メモ</Label>
          <Textarea
            name={fields.notes?.name}
            key={fields.notes?.key}
            placeholder="その日の体調や気づいたことを記録してください..."
            rows={3}
            disabled={pending}
            defaultValue={dailyLog.memo || ""}
          />
        </div>

        {/* 天気情報取得位置 */}
        <div className="space-y-2">
          <Label htmlFor="prefecture_id">
            <MapPin className="inline mr-2 h-4 w-4" />
            天気情報の取得位置
          </Label>
          <Select defaultValue={dailyLog.prefecture_id?.toString()} name={fields.prefecture_id?.name} disabled={pending}>
            <SelectTrigger>
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {prefectures.map((prefecture) => (
                <SelectItem
                  key={prefecture.id}
                  value={prefecture.id.toString()}
                >
                  {prefecture.name_ja}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            選択した都道府県の気温・湿度・気圧データを自動取得します
          </p>
          {fields.prefecture_id?.errors?.map((e) => (
            <p key={e} className="text-sm text-red-500">
              {e}
            </p>
          ))}
        </div>

        {/* ボタン */}
        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                更新中...
              </>
            ) : (
              "記録を更新"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
          >
            <X className="mr-2 h-4 w-4" />
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}
