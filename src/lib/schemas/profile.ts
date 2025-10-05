import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string({ required_error: "お名前を入力してください" })
    .min(1, "お名前を入力してください")
    .max(50, "お名前は50文字以内で入力してください"),
  prefecture_id: z
    .string({ required_error: "都道府県は必須です" })
    .min(1, "都道府県を選択してください"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
