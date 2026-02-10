"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { eveningReflectionSchema } from "@/lib/schemas/evening-reflection";

export async function getTodaySuggestions() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
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
    );

    if (res.ok) {
      return await res.json();
    } else {
      console.error("提案データ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("提案データ取得エラー:", error);
    return null;
  }
}

export async function getTodayDailyLog() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
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
    );

    if (res.ok) {
      return await res.json();
    } else if (res.status === 404) {
      return null; // 今日の記録が存在しない
    } else if (res.status === 401) {
      // 認証エラーの場合はnullを返して、ページ側でログインページにリダイレクト
      console.error("認証エラー - セッションが無効です");
      return null;
    } else {
      console.error("今日の記録取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("今日の記録取得エラー:", error);
    return null;
  }
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

  let result;
  try {
    // Rails APIを呼び出して夜の振り返りを保存
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
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("夜の振り返り保存失敗:", {
        status: res.status,
        statusText: res.statusText,
        error: errorData.error || errorData.errors,
        fullError: errorData,
      });

      const errorMessage =
        errorData.error ||
        errorData.errors?.join(", ") ||
        `夜の振り返りの保存に失敗しました (${res.status})`;

      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    result = await res.json();
    console.log("夜の振り返り保存成功:", result);
  } catch (error: unknown) {
    console.error("予期しないエラーが発生しました:", error);
    if (error instanceof Error) {
      console.error("エラースタック:", error.stack);
    }
    return submission.reply({
      formErrors: ["予期しないエラーが発生しました。もう一度お試しください。"],
    });
  }

  // 成功時は /dashboard にリダイレクト
  redirect("/dashboard");
}
