"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import type { WeeklyReportRange, WeeklyReportSuggestions } from "../types";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

interface WeeklySuggestionsChartProps {
  suggestions: WeeklyReportSuggestions | undefined;
  range: WeeklyReportRange;
}

export function WeeklySuggestionsChart({
  suggestions,
  range,
}: WeeklySuggestionsChartProps) {
  const byDay = suggestions?.by_day ?? [];
  const countByDate = Object.fromEntries(
    byDay.map((d) => [d.date, d.items.length])
  );

  const start = parseISO(range.start);
  const end = parseISO(range.end);
  const days: Date[] = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  const labels = days.map((d) => format(d, "M/d (E)", { locale: ja }));
  const data = days.map((d) => countByDate[format(d, "yyyy-MM-dd")] ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "提案数",
        data,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
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
          label: (context: TooltipItem<"bar">) => {
            const count = context.parsed.y;
            return `提案数: ${count}件`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 1,
        },
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
          <BarChart3 className="h-5 w-5" />
          日別提案数
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
