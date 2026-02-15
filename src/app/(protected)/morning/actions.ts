"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { morningDeclarationSchema } from "@/lib/schemas/morning-declaration";
import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";
import { parseApiError } from "@/lib/api/parse-error";

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
    },
  ).catch(() => null);

  if (!res) {
    return submission.reply({
      formErrors: ["通信エラーが発生しました。もう一度お試しください。"],
    });
  }
  if (res.status === 401) redirect("/signin");

  if (!res.ok) {
    const errorMessage = await parseApiError(
      res,
      "朝の自己申告の保存に失敗しました",
    );
    return submission.reply({
      formErrors: [errorMessage],
    });
  }

  redirect("/dashboard");
}
