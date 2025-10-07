"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { dailyLogSchema } from "@/lib/schemas/daily-log";
import { selfScoreSchema } from "@/lib/schemas/self-score";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/api-fetch";

export async function getPrefectures() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/prefectures`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
      }
    );

    if (res.ok) {
      return await res.json();
    } else {
      console.error("都道府県データ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("都道府県データ取得エラー:", error);
    return null;
  }
}

export async function getSuggestions() {
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
      }
    );

    if (res.ok) {
      return await res.json();
    } else if (res.status === 404) {
      return null;
    } else if (res.status === 401) {
      console.error("認証エラー - セッションが無効です");
      return null;
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
      }
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

export async function createDailyLogAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: dailyLogSchema });

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

  try {
    // Rails APIを呼び出して日次記録を作成
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
        body: JSON.stringify({
          daily_log: {
            date: data.date,
            prefecture_id: data.prefecture_id,
            sleep_hours: data.sleep_hours,
            mood_score: data.mood_score,
            symptoms: data.symptoms || [],
            notes: data.notes || "",
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("日次記録作成失敗:", {
        status: res.status,
        error: errorData.error || errorData.details,
      });

      const errorMessage =
        errorData.error || errorData.details || "日次記録の作成に失敗しました";

      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    const result = await res.json();
    console.log("日次記録作成成功:", result);

    // 成功時はリダイレクトしてページをリフレッシュ
    revalidatePath("/dashboard");
  } catch (error: unknown) {
    console.error("予期しないエラーが発生しました:", error);

    const errorMessage =
      "日次記録の作成に失敗しました。しばらく時間をおいて再度お試しください";

    return submission.reply({
      formErrors: [errorMessage],
    });
  }

  // try-catchブロックの外でリダイレクト
  redirect("/dashboard");
}

export async function updateDailyLogAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: dailyLogSchema });

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

  try {
    // 今日の記録のIDを取得
    const today = new Date().toISOString().split("T")[0];
    const getRes = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/date/${today}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
      }
    );

    if (!getRes.ok) {
      return submission.reply({
        formErrors: ["記録が見つかりません"],
      });
    }

    const dailyLog = await getRes.json();

    // Rails APIを呼び出して日次記録を更新
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/${dailyLog.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
        body: JSON.stringify({
          daily_log: {
            date: data.date,
            prefecture_id: data.prefecture_id,
            sleep_hours: data.sleep_hours,
            mood_score: data.mood_score,
            symptoms: data.symptoms || [],
            notes: data.notes || "",
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("日次記録更新失敗:", {
        status: res.status,
        error: errorData.error || errorData.details,
      });

      const errorMessage =
        errorData.error || errorData.details || "日次記録の更新に失敗しました";

      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    const result = await res.json();
    console.log("日次記録更新成功:", result);

    // 成功時はリダイレクトしてページをリフレッシュ
    revalidatePath("/dashboard");
  } catch (error: unknown) {
    console.error("予期しないエラーが発生しました:", error);

    const errorMessage =
      "日次記録の更新に失敗しました。しばらく時間をおいて再度お試しください";

    return submission.reply({
      formErrors: [errorMessage],
    });
  }

  // try-catchブロックの外でリダイレクト
  redirect("/dashboard");
}

export async function updateSelfScoreAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: selfScoreSchema });

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

  try {
    // 今日の記録のIDを取得
    const today = new Date().toISOString().split("T")[0];
    const getRes = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/date/${today}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
      }
    );

    if (!getRes.ok) {
      return submission.reply({
        formErrors: ["記録が見つかりません"],
      });
    }

    const dailyLog = await getRes.json();

    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/${dailyLog.id}/self_score`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
        body: JSON.stringify({
          self_score: data.self_score,
        }),
      }
    );

    if (!res.ok) {
      return submission.reply({
        formErrors: ["スコアの更新に失敗しました"],
      });
    }
  } catch (error: unknown) {
    console.error("予期しないエラーが発生しました:", error);

    const errorMessage =
      "スコアの更新に失敗しました。しばらく時間をおいて再度お試しください";

    return submission.reply({
      formErrors: [errorMessage],
    });
  }

  // try-catchブロックの外でリダイレクト
  redirect("/dashboard");
}

export async function getDefaultPrefecture() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/users/default_prefecture`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
      }
    );

    if (res.ok) {
      return await res.json();
    } else {
      console.error("デフォルト都道府県データ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("デフォルト都道府県データ取得エラー:", error);
    return null;
  }
}
