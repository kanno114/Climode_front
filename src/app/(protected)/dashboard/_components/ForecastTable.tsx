"use client";

import type { Ref } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Minus,
  Sun,
} from "lucide-react";

type WeatherCondition =
  | "clear"
  | "partly_cloudy"
  | "cloudy"
  | "rain"
  | "snow"
  | "thunder";

type HourForecast = {
  hour: number; // 0-23 (local)
  timeLabel: string; // "HH:00"
  condition: WeatherCondition;
  tempC: number;
  pressureHpa: number;
};

const DEFAULT_LABEL_W = 120;
const DEFAULT_CELL_W = 84; // だいたい1.2倍くらいの見た目を狙う

function getWeatherIcon(condition: WeatherCondition) {
  switch (condition) {
    case "clear":
      return { Icon: Sun, className: "text-amber-500" };
    case "partly_cloudy":
      return { Icon: CloudSun, className: "text-amber-500" };
    case "cloudy":
      return { Icon: Cloud, className: "text-slate-500" };
    case "rain":
      return { Icon: CloudRain, className: "text-blue-500" };
    case "snow":
      return { Icon: CloudSnow, className: "text-cyan-500" };
    case "thunder":
      return { Icon: CloudLightning, className: "text-purple-500" };
  }
}

function formatDelta(delta: number) {
  if (Math.abs(delta) < 0.05) return "0.0";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}`;
}

function getDeltaIcon(delta: number) {
  if (Math.abs(delta) < 0.05) return { Icon: Minus, className: "text-slate-400" };
  if (delta > 0) return { Icon: ArrowUp, className: "text-emerald-600" };
  return { Icon: ArrowDown, className: "text-orange-600" };
}

function buildDummyForecast(): HourForecast[] {
  // UI確認用のダミー。後で Phase2 で props に差し替える想定。
  const conditions: WeatherCondition[] = [
    "clear",
    "partly_cloudy",
    "cloudy",
    "rain",
    "cloudy",
    "partly_cloudy",
    "clear",
    "thunder",
    "rain",
    "cloudy",
    "clear",
    "snow",
  ];

  return Array.from({ length: 24 }).map((_, hour) => {
    const tempC = Math.round((8 + Math.sin((hour / 24) * Math.PI * 2) * 6) * 10) / 10;
    const pressureHpa =
      Math.round((1012 + Math.cos((hour / 24) * Math.PI * 2) * 4) * 10) / 10;
    const condition = conditions[hour % conditions.length] ?? "clear";
    const timeLabel = `${String(hour).padStart(2, "0")}:00`;
    return { hour, timeLabel, condition, tempC, pressureHpa };
  });
}

type ForecastTableProps = {
  forecast: HourForecast[];
  currentHour: number | null;
  scrollContainerRef?: Ref<HTMLDivElement>;
  labelWidthPx?: number;
  cellWidthPx?: number;
};

// 表示専用（純粋）コンポーネント：副作用なし / hooksなし
export function ForecastTable({
  forecast,
  currentHour,
  scrollContainerRef,
  labelWidthPx = DEFAULT_LABEL_W,
  cellWidthPx = DEFAULT_CELL_W,
}: ForecastTableProps) {
  const gridTemplateColumns = `${labelWidthPx}px repeat(${forecast.length}, ${cellWidthPx}px)`;
  const gridLine = "border-slate-200/70 dark:border-slate-700/60";
  return (
    <section
      className="rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-0 overflow-hidden"
      aria-label="24時間の天気予報"
    >
      <div ref={scrollContainerRef} className="overflow-x-auto">
        <div className="min-w-max text-base">
          {/* Header row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns,
            }}
          >
            <div
              className={[
                "sticky left-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-r px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 text-center",
                gridLine,
              ].join(" ")}
            >
              時刻
            </div>
            {forecast.map((h, idx) => {
              const isNow = currentHour != null && h.hour === currentHour;
              // 行（横）で交互に見せたいので、列（縦）では交互にしない
              const baseBg = "bg-white dark:bg-slate-950/20";
              const nowBg = "bg-amber-100/80 dark:bg-amber-900/30";
              const rightBorder = idx === forecast.length - 1 ? "" : `border-r ${gridLine}`;

              return (
                <div
                  key={h.hour}
                  className={[
                    `border-b ${gridLine} px-1 py-1.5 text-center font-semibold tabular-nums`,
                    rightBorder,
                    isNow ? nowBg : baseBg,
                  ].join(" ")}
                  title={isNow ? "現在時刻" : undefined}
                  data-row="time"
                  data-hour={h.hour}
                >
                  {h.timeLabel}
                </div>
              );
            })}
          </div>

          {/* Weather row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns,
            }}
          >
            <div
              className={[
                "sticky left-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-r px-2 py-2 font-semibold text-slate-700 dark:text-slate-200 text-center",
                gridLine,
              ].join(" ")}
            >
              天気
            </div>
            {forecast.map((h, idx) => {
              const isNow = currentHour != null && h.hour === currentHour;
              // 行（横）で交互に見せたいので、列（縦）では交互にしない
              const baseBg = "bg-slate-100/80 dark:bg-slate-800/45";
              const nowBg = "bg-amber-50/80 dark:bg-amber-950/20";
              const { Icon, className } = getWeatherIcon(h.condition);
              const rightBorder = idx === forecast.length - 1 ? "" : `border-r ${gridLine}`;

              return (
                <div
                  key={h.hour}
                  className={[
                    `border-b ${gridLine} px-1 py-2 flex items-center justify-center`,
                    rightBorder,
                    isNow ? nowBg : baseBg,
                  ].join(" ")}
                >
                  <Icon className={`h-5 w-5 ${className}`} />
                </div>
              );
            })}
          </div>

          {/* Temp row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns,
            }}
          >
            <div
              className={[
                "sticky left-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-r px-2 py-2 font-semibold text-slate-700 dark:text-slate-200 text-center",
                gridLine,
              ].join(" ")}
            >
              気温(℃)
            </div>
            {forecast.map((h, idx) => {
              const isNow = currentHour != null && h.hour === currentHour;
              // 行（横）で交互に見せたいので、列（縦）では交互にしない
              // 「時刻」行と同じ背景色に揃える
              const baseBg = "bg-white dark:bg-slate-950/20";
              const nowBg = "bg-amber-100/80 dark:bg-amber-900/30";
              const rightBorder = idx === forecast.length - 1 ? "" : `border-r ${gridLine}`;

              return (
                <div
                  key={h.hour}
                  className={[
                    `border-b ${gridLine} px-1 py-2 text-center tabular-nums`,
                    rightBorder,
                    isNow ? nowBg : baseBg,
                  ].join(" ")}
                >
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    {h.tempC.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pressure row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns,
            }}
          >
            <div
              className={[
                "sticky left-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-r border-b px-2 py-2 font-semibold text-slate-700 dark:text-slate-200 text-center",
                gridLine,
              ].join(" ")}
            >
              気圧(hPa)
            </div>
            {forecast.map((h, idx) => {
              const isNow = currentHour != null && h.hour === currentHour;
              // 行（横）で交互に見せたいので、列（縦）では交互にしない
              const baseBg = "bg-slate-100/80 dark:bg-slate-800/45";
              const nowBg = "bg-amber-50/80 dark:bg-amber-950/20";
              const rightBorder = idx === forecast.length - 1 ? "" : `border-r ${gridLine}`;

              const prev = forecast[idx - 1];
              const delta = prev ? h.pressureHpa - prev.pressureHpa : 0;
              const { Icon, className } = getDeltaIcon(prev ? delta : 0);

              return (
                <div
                  key={h.hour}
                  className={[
                    `border-b ${gridLine} px-1 py-2 text-center tabular-nums`,
                    rightBorder,
                    isNow ? nowBg : baseBg,
                  ].join(" ")}
                  title={prev ? `1時間前比 ${formatDelta(delta)} hPa` : "比較データなし"}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {h.pressureHpa.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-center gap-1 text-xs">
                    {prev ? (
                      <>
                        <Icon className={`h-3.5 w-3.5 ${className}`} />
                        <span className="text-slate-600 dark:text-slate-300">
                          {formatDelta(delta)}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// 副作用（現在時刻取得 / 自動スクロール）だけを持つラッパー
export function ForecastTableAutoScroll() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const forecast = useMemo(() => buildDummyForecast(), []);
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    // SSR とブラウザで時刻/タイムゾーンがズレると hydration mismatch になるため、
    // 現在時刻の確定はクライアント側で行う。
    setCurrentHour(new Date().getHours());
  }, []);

  useEffect(() => {
    if (currentHour == null) return;
    const container = scrollRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(
      `[data-row="time"][data-hour="${currentHour}"]`
    );

    if (target) {
      target.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
      });
      return;
    }

    // 念のためのフォールバック
    container.scrollLeft = Math.max(0, currentHour * DEFAULT_CELL_W - DEFAULT_CELL_W * 2);
  }, [currentHour]);

  return (
    <ForecastTable
      forecast={forecast}
      currentHour={currentHour}
      scrollContainerRef={scrollRef}
    />
  );
}

