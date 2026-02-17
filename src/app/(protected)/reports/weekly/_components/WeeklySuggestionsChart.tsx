"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import {
  LEVEL_CHART_COLORS,
  LEVEL_LABELS,
} from "@/lib/suggestion-constants";
import type { WeeklyReportRange, WeeklyReportSuggestions } from "../types";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const LEVEL_ORDER = ["Danger", "Warning", "Caution", "Notice", "Optimal", "Good", "Temperature", "Humidity", "Pressure"];
const OTHER_LEVEL_KEY = "__other__";

interface WeeklySuggestionsChartProps {
  suggestions: WeeklyReportSuggestions | undefined;
  range: WeeklyReportRange;
}

export function WeeklySuggestionsChart({
  suggestions,
  range,
}: WeeklySuggestionsChartProps) {
  const byDay = suggestions?.by_day ?? [];

  const { chartData } = useMemo(() => {
    const start = parseISO(range.start);
    const end = parseISO(range.end);
    const days: Date[] = [];
    let current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }

    const dateStrings = days.map((d) => format(d, "yyyy-MM-dd"));
    const labels = days.map((d) => format(d, "M/d (E)", { locale: ja }));

    // 日付ごとにlevel別の件数を集計
    const countByDateAndLevel: Record<string, Record<string, number>> = {};
    dateStrings.forEach((ds) => {
      countByDateAndLevel[ds] = {};
    });

    const allLevels = new Set<string>();
    byDay.forEach(({ date, items }) => {
      items.forEach((item) => {
        const level = item.level && LEVEL_ORDER.includes(item.level)
          ? item.level
          : item.level || OTHER_LEVEL_KEY;
        allLevels.add(level);
        if (!countByDateAndLevel[date]) {
          countByDateAndLevel[date] = {};
        }
        countByDateAndLevel[date][level] = (countByDateAndLevel[date][level] ?? 0) + 1;
      });
    });

    const orderedLevels = [
      ...LEVEL_ORDER.filter((l) => allLevels.has(l)),
      ...(allLevels.has(OTHER_LEVEL_KEY) ? [OTHER_LEVEL_KEY] : []),
    ];

    const datasets = orderedLevels.map((level) => {
      const color = LEVEL_CHART_COLORS[level] ?? "rgba(100, 116, 139, 0.8)";
      const label = level === OTHER_LEVEL_KEY ? "その他" : (LEVEL_LABELS[level] ?? level);
      return {
        label,
        data: dateStrings.map((ds) => countByDateAndLevel[ds]?.[level] ?? 0),
        backgroundColor: color,
        borderColor: color.replace("0.8)", "1)"),
        borderWidth: 1,
        stack: "stack1",
      };
    });

    return {
      chartData: {
        labels,
        datasets,
      },
    };
  }, [byDay, range.start, range.end]);

  const options = useMemo(
    () => ({
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
            label: (context: TooltipItem<"bar">) => {
              const count = context.parsed.y;
              if (count === 0) return "";
              return `${context.dataset.label}: ${count}件`;
            },
            footer: (items: TooltipItem<"bar">[]) => {
              const total = items.reduce((sum, i) => sum + (i.parsed.y as number), 0);
              return total > 0 ? `合計: ${total}件` : undefined;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          min: 0,
          ticks: {
            stepSize: 1,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
      },
    }),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          日別提案数
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]" role="img" aria-label="日別提案数グラフ: レベル別の提案件数を積み上げ棒グラフで表示">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
