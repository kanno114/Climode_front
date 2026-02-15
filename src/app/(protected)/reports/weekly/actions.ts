"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";
import { redirect } from "next/navigation";
import type { WeeklyReport } from "./types";

/**
 * 週の開始日（月曜日）を計算
 */
function calculateWeekStart(date: Date = new Date()): string {
  const day = date.getDay();
  // 月曜日が0、日曜日が6になるように調整
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

/**
 * 週次レポートを取得
 */
export async function getWeeklyReport(
  weekStart?: string
): Promise<WeeklyReport | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const startDate = weekStart || calculateWeekStart();

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/reports/weekly?start=${startDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    },
  ).catch(() => null);

  if (!res) return null;
  if (res.status === 401) redirect("/signin");
  if (!res.ok) return null;

  return await res.json();
}
