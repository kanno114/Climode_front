import { z } from "zod";

export const morningDeclarationSchema = z.object({
  sleep_hours: z
    .number({ required_error: "睡眠時間は必須です" })
    .min(0, "睡眠時間は0時間以上で入力してください")
    .max(12, "睡眠時間は12時間以下で入力してください"),
  mood: z
    .number({ required_error: "気分は必須です" })
    .min(1, "気分は1以上で入力してください")
    .max(5, "気分は5以下で入力してください"),
  fatigue: z
    .number({ required_error: "疲労感は必須です" })
    .min(1, "疲労感は1以上で入力してください")
    .max(5, "疲労感は5以下で入力してください"),
});

export type MorningDeclarationFormData = z.infer<
  typeof morningDeclarationSchema
>;
