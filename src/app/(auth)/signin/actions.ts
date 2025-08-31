"use server";

import { signIn } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { signInSchema } from "@/lib/schemas/signin";

export async function signInAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signInSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.payload;

  try {
    // 直接Rails APIを呼び出して認証
    const res = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: { email, password },
        }),
      }
    );

    // Rails APIからのレスポンスを処理
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Rails API認証失敗:", {
        status: res.status,
        error: errorData.error || errorData.details,
      });

      // Rails側のエラーメッセージをそのまま使用
      const errorMessage =
        errorData.error ||
        errorData.details ||
        "メールアドレスまたはパスワードが正しくありません";

      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    const userData = await res.json();
    const { id, name } = userData;

    // 認証成功時はAuth.jsでセッション確立
    const result = await signIn("credentials", {
      email,
      password,
      id,
      name,
      redirect: false,
    });

    if (result?.error) {
      console.error("Auth.jsセッション確立失敗:", result.error);
      return submission.reply({
        formErrors: ["セッションの確立に失敗しました。再度お試しください"],
      });
    }
  } catch (error: unknown) {
    console.error("予期しないエラーが発生しました:", error);

    // エラーの種類に応じてメッセージを分ける
    const errorMessage =
      "ログインに失敗しました。しばらく時間をおいて再度お試しください";

    return submission.reply({
      formErrors: [errorMessage],
    });
  }

  redirect("/dashboard");
}
