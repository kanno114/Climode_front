"use server";

import { signIn } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(1, "お名前を入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string().min(1, "パスワード確認を入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export async function signUpAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { name, email, password } = submission.payload;

  let success = false;

  try {
    // Rails APIにユーザー登録リクエスト
    const response = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user: {
            name,
            email,
            password,
            password_confirmation: submission.payload.confirmPassword,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("登録失敗:", errorData.errors || errorData);
      return;
    }

    // 登録成功後、自動ログイン
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      console.error("ログイン失敗:", signInResult.error);
      return;
    }

    success = true;
  } catch (error: unknown) {
    console.error(
      "予期しないエラーが発生しました:",
      error instanceof Error ? error.message : String(error)
    );
  }

  if (success) {
    redirect("/dashboard");
  }
}
