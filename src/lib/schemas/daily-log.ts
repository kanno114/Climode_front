import { z } from "zod";

export const dailyLogSchema = z.object({
  date: z.string({ required_error: "日付は必須です" }).refine((date) => {
    const today = new Date().toISOString().split("T")[0];
    return date === today;
  }, "今日の日付のみ記録できます"),
  prefecture_id: z
    .string({ required_error: "都道府県は必須です" })
    .min(1, "都道府県を選択してください"),
  sleep_hours: z
    .number({ required_error: "睡眠時間は必須です" })
    .min(0, "睡眠時間は0時間以上で入力してください")
    .max(24, "睡眠時間は24時間以下で入力してください"),
  mood_score: z
    .number({ required_error: "気分スコアは必須です" })
    .min(-5, "気分スコアは-5以上で入力してください")
    .max(5, "気分スコアは5以下で入力してください"),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type DailyLogFormData = z.infer<typeof dailyLogSchema>;
