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
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
