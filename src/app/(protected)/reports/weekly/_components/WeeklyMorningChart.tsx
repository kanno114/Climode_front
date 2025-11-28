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
import type { WeeklyReportDaily } from "../types";
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

interface WeeklyMorningChartProps {
  daily: WeeklyReportDaily;
}

export function WeeklyMorningChart({ daily }: WeeklyMorningChartProps) {
  if (daily.by_day.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            朝の自己申告推移
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

  const sleepHoursData = sortedDays.map((day) => day.sleep_hours);
  const moodData = sortedDays.map((day) => day.mood);
  const fatigueData = sortedDays.map((day) => day.fatigue_level);

  const chartData = {
    labels,
    datasets: [
      {
        label: "睡眠時間（時間）",
        data: sleepHoursData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "気分",
        data: moodData,
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "疲労感",
        data: fatigueData,
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            if (context.parsed.y === null) {
              return `${context.dataset.label || ""}: データなし`;
            }
            const unit = context.dataset.label?.includes("時間") ? "時間" : "";
            return `${context.dataset.label || ""}: ${context.parsed.y}${unit}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 12,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
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
          朝の自己申告推移
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
