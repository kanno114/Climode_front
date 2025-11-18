"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { WeeklyReportSignals } from "../types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklySignalChartProps {
  signals: WeeklyReportSignals;
}

export function WeeklySignalChart({ signals }: WeeklySignalChartProps) {
  if (signals.by_day.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            日別発生推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">
            今週はシグナルが検出されませんでした
          </p>
        </CardContent>
      </Card>
    );
  }

  const labels = signals.by_day.map((item) =>
    format(new Date(item.date), "M/d (E)", { locale: ja })
  );

  const data = signals.by_day.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "シグナル発生数",
        data: data,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
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
          label: (context: { parsed: { y: number } }) =>
            `発生数: ${context.parsed.y}回`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
          日別発生推移
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

