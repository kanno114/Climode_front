import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "パスワードは必須です" })
      .min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z
      .string({ required_error: "パスワード確認は必須です" })
      .min(1, "パスワード確認を入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
