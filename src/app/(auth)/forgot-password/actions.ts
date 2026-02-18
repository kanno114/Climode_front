"use server";

import { parseWithZod } from "@conform-to/zod";
import { forgotPasswordSchema } from "@/lib/schemas/forgot-password";
import { parseApiError } from "@/lib/api/parse-error";

export async function forgotPasswordAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: forgotPasswordSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email } = submission.payload;

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/password_resets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          password_reset: { email },
        }),
      }
    );

    if (!res.ok) {
      const errorMessage = await parseApiError(
        res,
        "パスワードリセットの送信に失敗しました",
      );
      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    const data = await res.json();

    // OAuthユーザーの場合
    if (data.oauth_provider) {
      return submission.reply({
        formErrors: [data.message],
      });
    }

    // 成功時は status: "success" を返す
    return submission.reply();
  } catch {
    return submission.reply({
      formErrors: ["送信に失敗しました。しばらく時間をおいて再度お試しください"],
    });
  }
}
