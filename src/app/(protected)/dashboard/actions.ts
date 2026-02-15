"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";
import { redirect } from "next/navigation";

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

export async function getForecastSeries(): Promise<ForecastPoint[] | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/forecast`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
      next: { revalidate: 600 },
    },
  ).catch(() => null);

  if (!res) return null;
  if (res.status === 401) redirect("/signin");
  if (!res.ok) return null;

  const json = (await res.json()) as ForecastPoint[];
  return Array.isArray(json) ? json : [];
}
