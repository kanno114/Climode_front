"use server";

import { auth } from "@/auth";
import { apiFetch } from "@/lib/api/api-fetch";

export interface DailyLogData {
  id: number;
  date: string;
  score: number | null;
  self_score: number | null;
  sleep_hours: number | null;
  mood: number | null;
  fatigue: number | null;
  memo: string;
  prefecture: {
    id: number;
    name: string;
  };
}

/**
 * 今日から過去7日間の日付配列を生成
 */
function generateLast7Days(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // YYYY-MM-DD形式に変換
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
}

export async function getWeeklyDailyLogs(): Promise<DailyLogData[] | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

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
      const allData: DailyLogData[] = await res.json();

      // 今日から過去7日間の日付を生成
      const last7Days = generateLast7Days();

      // データをマップ化（日付をキーにする）
      const dataMap = new Map<string, DailyLogData>();
      allData.forEach((log) => {
        dataMap.set(log.date, log);
      });

      // 過去7日間の日付に対応するデータを取得（記録がある日のみ）
      const weeklyData = last7Days
        .map((date) => dataMap.get(date))
        .filter((log): log is DailyLogData => log !== undefined);

      return weeklyData;
    } else {
      console.error("週間データ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("週間データ取得エラー:", error);
    return null;
  }
}
