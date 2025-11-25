"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";

export async function getTodaySignals(category?: "env" | "body") {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const url = new URL(
      `${process.env.API_BASE_URL_SERVER}/api/v1/signal_events/today`
    );
    if (category) {
      url.searchParams.set("category", category);
    }

    const res = await apiFetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      return await res.json();
    } else if (res.status === 401) {
      console.error("認証エラー - セッションが無効です");
      return null;
    } else {
      console.error("シグナルデータ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("シグナルデータ取得エラー:", error);
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

