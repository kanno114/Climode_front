import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
    .string({ required_error: "お名前を入力してください" })
    .min(1, "お名前を入力してください"),
    email: z.string({ required_error: "メールアドレスは必須です" })
    .email("有効なメールアドレスを入力してください"),
    password: z.string({ required_error: "パスワードは必須です" })
    .min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string({ required_error: "パスワード確認は必須です" })
    .min(1, "パスワード確認を入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
