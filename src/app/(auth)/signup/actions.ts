"use server";

import { signIn } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { signUpSchema } from "@/lib/schemas/signup";

export async function signUpAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["入力内容を確認してください"],
    });
  }

  const { name, email, password } = submission.payload;

  try {
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

      // Railsからのエラーメッセージを処理
      let errorMessages: string[] = [];

      if (errorData.errors) {
        // Railsのバリデーションエラーの場合
        if (typeof errorData.errors === "object") {
          // フィールド別のエラーメッセージを配列に変換
          Object.values(errorData.errors).forEach((fieldErrors: unknown) => {
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else if (typeof fieldErrors === "string") {
              errorMessages.push(fieldErrors);
            }
          });
        } else if (Array.isArray(errorData.errors)) {
          errorMessages = errorData.errors;
        }
      } else if (errorData.error) {
        // 単一のエラーメッセージの場合
        errorMessages = [errorData.error];
      } else if (errorData.message) {
        // messageフィールドの場合
        errorMessages = [errorData.message];
      } else {
        // デフォルトエラーメッセージ
        errorMessages = ["登録に失敗しました"];
      }

      return submission.reply({
        formErrors: errorMessages,
      });
    }

    // 登録成功後、自動ログイン
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      console.error("ログイン失敗:", signInResult.error);
      return submission.reply({
        formErrors: ["認証に失敗しました"],
      });
    }
  } catch (error: unknown) {
    console.error(
      "予期しないエラーが発生しました:",
      error instanceof Error ? error.message : String(error)
    );
    return submission.reply({
      formErrors: ["予期しないエラーが発生しました"],
    });
  }

  if (submission.status === "success") {
    redirect("/dashboard");
  }
}
