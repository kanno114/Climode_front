"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";

// 初期表示用: 過去30日分の記録を取得
export async function getDailyLogs() {
  const session = await auth();
  if (!session?.user) return null;

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/date_range_30days`,
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
      return null;
    }
  } catch {
    return null;
  }
}

// 月単位での取得用: カレンダーのページネーションで使用
export async function getDailyLogsByMonth(year: number, month: number) {
  const session = await auth();
  if (!session?.user) return null;

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/daily_logs/by_month?year=${year}&month=${month}`,
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
      return null;
    }
  } catch {
    return null;
  }
}