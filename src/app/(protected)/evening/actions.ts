"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";
import { parseApiError } from "@/lib/api/parse-error";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { eveningReflectionSchema } from "@/lib/schemas/evening-reflection";

export async function getTodaySuggestions() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/suggestions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
    },
  ).catch(() => null);

  if (!res) return null;
  if (res.status === 401) redirect("/signin");
  if (!res.ok) return null;

  return await res.json();
}

export async function getTodayDailyLog() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];
  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/date/${today}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
    },
  ).catch(() => null);

  if (!res) return null;
  if (res.status === 401) redirect("/signin");
  if (res.status === 404) return null;
  if (!res.ok) return null;

  return await res.json();
}

export async function submitEveningReflection(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: eveningReflectionSchema,
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
    `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/evening`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
      body: JSON.stringify({
        note: data.note || "",
        self_score: data.self_score || null,
        suggestion_feedbacks: data.suggestion_feedbacks || [],
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
      "夜の振り返りの保存に失敗しました",
    );
    return submission.reply({
      formErrors: [errorMessage],
    });
  }

  redirect("/dashboard");
}
