"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";

export async function getDailyLog(id: string) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/${id}`,
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


export async function getSuggestionsByDate(date: string) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const url = new URL(
      `${process.env.API_BASE_URL_SERVER}/api/v1/suggestions`,
    );
    url.searchParams.set("date", date);

    const res = await apiFetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
    });

    if (res.ok) {
      return await res.json();
    } else if (res.status === 404) {
      return null; // DailyLogが見つからない場合
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
