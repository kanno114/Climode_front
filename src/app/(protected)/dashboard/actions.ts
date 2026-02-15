"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";

export type ForecastPoint = {
  time: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  weather_code: number | null;
};

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
      },
    );

    if (res.ok) {
      return await res.json();
    } else if (res.status === 404) {
      return null;
    } else {
      return null;
    }
  } catch {
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
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

export async function getForecastSeries(): Promise<ForecastPoint[] | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/forecast`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
        // 予報なので、10分程度のキャッシュで十分
        next: { revalidate: 600 },
      },
    );

    if (res.ok) {
      const json = (await res.json()) as ForecastPoint[];
      return Array.isArray(json) ? json : [];
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
