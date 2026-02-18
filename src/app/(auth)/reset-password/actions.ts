"use server";

import { parseWithZod } from "@conform-to/zod";
import { resetPasswordSchema } from "@/lib/schemas/reset-password";
import { parseApiError } from "@/lib/api/parse-error";

export async function resetPasswordAction(
  token: string,
  _: unknown,
  formData: FormData
) {
  const submission = parseWithZod(formData, { schema: resetPasswordSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { password, confirmPassword } = submission.payload;

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/password_resets/0`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          password_reset: {
            token,
            password,
            password_confirmation: confirmPassword,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorMessage = await parseApiError(
        res,
        "パスワードの更新に失敗しました",
      );
      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    return submission.reply();
  } catch {
    return submission.reply({
      formErrors: [
        "パスワードの更新に失敗しました。しばらく時間をおいて再度お試しください",
      ],
    });
  }
}
