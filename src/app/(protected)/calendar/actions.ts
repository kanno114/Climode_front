"use server";

import { auth } from "@/auth";

export async function getDailyLogs() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await fetch(
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
      console.error("カレンダーイベント取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("カレンダーイベント取得エラー:", error);
    return null;
  }
}