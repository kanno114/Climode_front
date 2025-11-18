"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { morningDeclarationSchema } from "@/lib/schemas/morning-declaration";
import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";

export async function submitMorningDeclaration(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: morningDeclarationSchema,
  });

  const session = await auth();
  if (!session?.user) {
    return submission.reply({
      formErrors: ["ログインが必要です"],
    });
  }

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = submission.payload;

  let result;
  try {
    // Rails APIを呼び出して朝の自己申告を保存
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/morning`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
        body: JSON.stringify({
          sleep_hours: data.sleep_hours,
          mood: data.mood,
          fatigue: data.fatigue,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("朝の自己申告保存失敗:", {
        status: res.status,
        error: errorData.error || errorData.errors,
      });

      const errorMessage =
        errorData.error ||
        errorData.errors?.join(", ") ||
        "朝の自己申告の保存に失敗しました";

      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    result = await res.json();
    console.log("朝の自己申告保存成功:", result);
  } catch (error: unknown) {
    console.error("予期しないエラーが発生しました:", error);
    return submission.reply({
      formErrors: ["予期しないエラーが発生しました。もう一度お試しください。"],
    });
  }

  // 成功時は /dashboard にリダイレクト
  // redirect()は内部でエラーをスローするため、try-catchの外で呼び出す
  redirect("/dashboard");
}
