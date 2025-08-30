import { z } from "zod";

export const signInSchema = z.object({
  email: z
  .string({ required_error: "メールアドレスは必須です" })
  .email("メールアドレスの形式が正しくありません"),

  password: z
  .string({ required_error: "パスワードは必須です" })
  .min(8, "パスワードを入力してください"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
