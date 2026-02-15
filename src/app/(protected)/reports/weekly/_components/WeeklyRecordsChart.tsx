"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import type { WeeklyReportDaily, WeeklyReportFeedback } from "../types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type MetricKey = "sleep" | "mood" | "fatigue" | "selfScore";

const METRICS: {
  key: MetricKey;
  label: string;
  color: string;
  bgColor: string;
  yAxisID: string;
  unit: string;
}[] = [
  {
    key: "sleep",
    label: "睡眠",
    color: "rgb(59, 130, 246)",
    bgColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    yAxisID: "y-sleep",
    unit: "時間",
  },
  {
    key: "mood",
    label: "気分",
    color: "rgb(236, 72, 153)",
    bgColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    yAxisID: "y-score",
    unit: "/5",
  },
  {
    key: "fatigue",
    label: "疲労",
    color: "rgb(249, 115, 22)",
    bgColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    yAxisID: "y-score",
    unit: "/5",
  },
  {
    key: "selfScore",
    label: "スコア",
    color: "rgb(168, 85, 247)",
    bgColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    yAxisID: "y-score",
    unit: "",
  },
];

interface WeeklyRecordsChartProps {
  daily: WeeklyReportDaily;
  feedback: WeeklyReportFeedback;
}

export function WeeklyRecordsChart({
  daily,
  feedback,
}: WeeklyRecordsChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(["sleep"])
  );

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (daily.by_day.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            週間推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週は記録がありませんでした
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedDays = [...daily.by_day].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedDays.map((day) =>
    format(new Date(day.date), "M/d (E)", { locale: ja })
  );

  const selfScoreMap = new Map<string, number | null>();
  feedback.by_day.forEach((day) => {
    selfScoreMap.set(day.date, day.self_score);
  });

  const dataMap: Record<MetricKey, (number | null)[]> = {
    sleep: sortedDays.map((day) => day.sleep_hours),
    mood: sortedDays.map((day) => day.mood),
    fatigue: sortedDays.map((day) => day.fatigue_level),
    selfScore: sortedDays.map((day) => selfScoreMap.get(day.date) ?? null),
  };

  const needsSleepAxis = activeMetrics.has("sleep");
  const needsScoreAxis =
    activeMetrics.has("mood") ||
    activeMetrics.has("fatigue") ||
    activeMetrics.has("selfScore");

  const datasets = METRICS.filter((m) => activeMetrics.has(m.key)).map((m) => ({
    label: m.label,
    data: dataMap[m.key],
    borderColor: m.color,
    backgroundColor: m.color.replace("rgb", "rgba").replace(")", ", 0.1)"),
    tension: 0.4,
    fill: false,
    yAxisID: m.yAxisID,
    pointRadius: 4,
    pointHoverRadius: 6,
    borderDash: m.key === "selfScore" ? [4, 4] : undefined,
  }));

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            if (context.parsed.y === null) {
              return `${context.dataset.label || ""}: データなし`;
            }
            const metric = METRICS.find((m) => m.label === context.dataset.label);
            return `${context.dataset.label}: ${context.parsed.y}${metric?.unit || ""}`;
          },
        },
      },
    },
    scales: {
      ...(needsSleepAxis && {
        "y-sleep": {
          type: "linear" as const,
          display: true,
          position: "left" as const,
          beginAtZero: true,
          min: 0,
          max: 12,
          title: {
            display: true,
            text: "睡眠時間 (h)",
            font: { size: 11 },
          },
          grid: { color: "rgba(59, 130, 246, 0.08)" },
          ticks: { color: "rgb(59, 130, 246)" },
        },
      }),
      ...(needsScoreAxis && {
        "y-score": {
          type: "linear" as const,
          display: true,
          position: (needsSleepAxis ? "right" : "left") as "left" | "right",
          beginAtZero: true,
          min: 0,
          max: 5,
          title: {
            display: true,
            text: "スコア (1-5)",
            font: { size: 11 },
          },
          grid: { drawOnChartArea: !needsSleepAxis },
          ticks: { stepSize: 1 },
        },
      }),
      x: { grid: { display: false } },
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            週間推移
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {METRICS.map((m) => {
              const isActive = activeMetrics.has(m.key);
              return (
                <Button
                  key={m.key}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2.5 text-xs rounded-full transition-colors ${
                    isActive
                      ? m.bgColor
                      : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                  }`}
                  onClick={() => toggleMetric(m.key)}
                >
                  {m.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
