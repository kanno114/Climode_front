import { z } from "zod";

export const selfScoreSchema = z.object({
  self_score: z
    .number({ required_error: "スコアは必須です" })
    .min(0, "スコアは0以上で入力してください")
    .max(100, "スコアは100以下で入力してください"),
});

export type SelfScoreFormData = z.infer<typeof selfScoreSchema>;
