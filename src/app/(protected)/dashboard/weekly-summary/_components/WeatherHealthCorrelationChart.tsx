"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyLogData } from "../actions";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherHealthCorrelationChartProps {
  data: DailyLogData[];
}

export function WeatherHealthCorrelationChart({
  data,
}: WeatherHealthCorrelationChartProps) {
  const labels = data.map((log) =>
    format(new Date(log.date), "M/d (E)", { locale: ja })
  );

  const scores = data.map((log) => log.score ?? 0);
  const temperatures = data.map(
    (log) => log.weather_observation?.temperature_c ?? null
  );
  const humidity = data.map(
    (log) => log.weather_observation?.humidity_pct ?? null
  );

  const chartData = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "体調スコア",
        data: scores,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
      {
        type: "line" as const,
        label: "気温 (°C)",
        data: temperatures,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        yAxisID: "y1",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        type: "line" as const,
        label: "湿度 (%)",
        data: humidity,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        yAxisID: "y1",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "体調スコア",
          color: "rgb(59, 130, 246)",
        },
        grid: {
          color: "rgba(59, 130, 246, 0.1)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "気温 (°C) / 湿度 (%)",
          color: "rgb(107, 114, 128)",
        },
        grid: {
          drawOnChartArea: false,
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
        <CardTitle className="text-lg">天気と体調の相関</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
