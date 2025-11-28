"use client";

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
import { LineChart } from "lucide-react";
import type { WeeklyReportFeedback } from "../types";
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

interface WeeklyEveningChartProps {
  feedback: WeeklyReportFeedback;
}

export function WeeklyEveningChart({ feedback }: WeeklyEveningChartProps) {
  const sortedDays = [...feedback.by_day].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const hasSelfScore = sortedDays.some((day) => day.self_score !== null);

  if (!hasSelfScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            夜の振り返り推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週はセルフスコアの記録がありませんでした
          </p>
        </CardContent>
      </Card>
    );
  }

  const labels = sortedDays.map((day) =>
    format(new Date(day.date), "M/d (E)", { locale: ja })
  );

  // セルフスコアデータ（1-3の値、nullの場合はnullのまま）
  const selfScoreData = sortedDays.map((day) => day.self_score);

  const chartData = {
    labels,
    datasets: [
      {
        label: "セルフスコア",
        data: selfScoreData,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            if (context.parsed.y === null) {
              return "セルフスコア: 記録なし";
            }
            const scoreLabels: Record<number, string> = {
              1: "低",
              2: "中",
              3: "高",
            };
            return `セルフスコア: ${context.parsed.y} (${
              scoreLabels[context.parsed.y as 1 | 2 | 3] || ""
            })`;
          },
        },
      },
    },
    scales: {
      y: {
        display: true,
        beginAtZero: false,
        min: 0,
        max: 3.5,
        ticks: {
          stepSize: 1,
          callback: (tickValue: string | number) => {
            const value =
              typeof tickValue === "number" ? tickValue : Number(tickValue);
            if (value === 1) return "低";
            if (value === 2) return "中";
            if (value === 3) return "高";
            return "";
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "セルフスコア",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          夜の振り返り推移
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
