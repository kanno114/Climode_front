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

// API (/api/v1/forecast) から返ってくる 1 点分のデータ形
type ForecastPointFromApi = {
  time: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  weather_code: number | null;
};

const DEFAULT_LABEL_W = 100;
const DEFAULT_CELL_W = 72;

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

function mapWeatherCodeToCondition(
  code: number | null | undefined
): WeatherCondition {
  if (code == null) return "clear";

  // Open-Meteo weather_code にざっくり対応
  if (code === 0) return "clear";
  if ([1, 2].includes(code)) return "partly_cloudy";
  if ([3, 45, 48].includes(code)) return "cloudy";
  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82,
    ].includes(code)
  ) {
    return "rain";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "thunder";

  return "clear";
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
  mobileScrollContainerRef?: Ref<HTMLDivElement>;
  labelWidthPx?: number;
  cellWidthPx?: number;
};

// モバイル用縦リスト表示
function ForecastMobileList({
  forecast,
  currentHour,
  scrollContainerRef,
}: {
  forecast: HourForecast[];
  currentHour: number | null;
  scrollContainerRef?: Ref<HTMLDivElement>;
}) {
  const gridLine = "border-slate-200/70 dark:border-slate-700/60";
  return (
    <div
      ref={scrollContainerRef}
      className="max-h-[min(45vh,20rem)] overflow-y-auto"
    >
      {/* ヘッダー行 */}
      <div
        className={`sticky top-0 z-10 grid grid-cols-[3fr_1.5fr_3fr_5fr] gap-x-1 items-center px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b ${gridLine}`}
      >
        <span className="text-center">時刻</span>
        <span className="text-center">天気</span>
        <span className="text-center">気温</span>
        <span className="text-center">気圧 (前時間比)</span>
      </div>
      {forecast.map((h, idx) => {
        const isNow = currentHour != null && h.hour === currentHour;
        const evenBg = "bg-slate-50/80 dark:bg-slate-800/30";
        const oddBg = "bg-white dark:bg-slate-950/20";
        const nowBg = "bg-amber-100/80 dark:bg-amber-900/30";
        const bg = isNow ? nowBg : idx % 2 === 0 ? evenBg : oddBg;
        const { Icon, className } = getWeatherIcon(h.condition);

        const prev = forecast[idx - 1];
        const delta = prev ? h.pressureHpa - prev.pressureHpa : 0;
        const {
          Icon: DeltaIcon,
          className: deltaClassName,
        } = getDeltaIcon(prev ? delta : 0);

        return (
          <div
            key={h.hour}
            data-mobile-hour={h.hour}
            className={`grid grid-cols-[3fr_1.5fr_3fr_5fr] gap-x-1 items-center px-3 py-2 text-sm tabular-nums border-b ${gridLine} ${bg}`}
          >
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-center">
              {h.timeLabel}
            </span>
            <span className="flex justify-center">
              <Icon className={`h-4 w-4 ${className}`} />
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-50 text-center">
              {h.tempC.toFixed(1)}
            </span>
            <span className="flex items-center justify-center gap-1 text-slate-900 dark:text-slate-50">
              <span className="font-semibold">{h.pressureHpa.toFixed(1)}</span>
              {prev ? (
                <span className="flex items-center gap-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <DeltaIcon className={`h-3 w-3 ${deltaClassName}`} />
                  {formatDelta(delta)}
                </span>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// PC用横スクロール表示
function ForecastDesktopGrid({
  forecast,
  currentHour,
  scrollContainerRef,
  labelWidthPx = DEFAULT_LABEL_W,
  cellWidthPx = DEFAULT_CELL_W,
}: {
  forecast: HourForecast[];
  currentHour: number | null;
  scrollContainerRef?: Ref<HTMLDivElement>;
  labelWidthPx?: number;
  cellWidthPx?: number;
}) {
  const gridTemplateColumns = `${labelWidthPx}px repeat(${forecast.length}, ${cellWidthPx}px)`;
  const gridLine = "border-slate-200/70 dark:border-slate-700/60";
  return (
    <div ref={scrollContainerRef} className="overflow-x-auto">
      <div className="min-w-max text-sm">
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
                <Icon className={`h-4 w-4 ${className}`} />
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
            <div>気圧(hPa)</div>
            <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
              前時間比
            </div>
          </div>
          {forecast.map((h, idx) => {
            const isNow = currentHour != null && h.hour === currentHour;
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
                      <Icon className={`h-3 w-3 ${className}`} />
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
  );
}

// 表示専用（純粋）コンポーネント：副作用なし / hooksなし
export function ForecastTable({
  forecast,
  currentHour,
  scrollContainerRef,
  mobileScrollContainerRef,
  labelWidthPx = DEFAULT_LABEL_W,
  cellWidthPx = DEFAULT_CELL_W,
}: ForecastTableProps) {
  return (
    <section
      className="rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-0 overflow-hidden"
      aria-label="24時間の天気予報"
    >
      {/* モバイル: 縦リスト */}
      <div className="md:hidden">
        <ForecastMobileList
          forecast={forecast}
          currentHour={currentHour}
          scrollContainerRef={mobileScrollContainerRef}
        />
      </div>
      {/* PC/タブレット: 横スクロール */}
      <div className="hidden md:block">
        <ForecastDesktopGrid
          forecast={forecast}
          currentHour={currentHour}
          scrollContainerRef={scrollContainerRef}
          labelWidthPx={labelWidthPx}
          cellWidthPx={cellWidthPx}
        />
      </div>
    </section>
  );
}

// 副作用（現在時刻取得 / 自動スクロール）だけを持つラッパー
export function ForecastTableAutoScroll({
  forecast,
}: {
  forecast: ForecastPointFromApi[] | null;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  const hourForecast = useMemo<HourForecast[]>(() => {
    if (!Array.isArray(forecast) || forecast.length === 0) {
      // バックエンドやネットワークに問題があっても UI 自体は確認できるようダミーにフォールバック
      return buildDummyForecast();
    }

    return forecast.map((point, index) => {
      // SSR/CSR 間のタイムゾーン差による hydration mismatch を避けるため、
      // 表示用の hour / timeLabel は Date ではなくインデックスから決め打ちする。
      const hour = index % 24;
      const timeLabel = `${String(hour).padStart(2, "0")}:00`;
      const condition = mapWeatherCodeToCondition(point.weather_code ?? null);

      return {
        hour,
        timeLabel,
        condition,
        tempC: typeof point.temperature_c === "number" ? point.temperature_c : NaN,
        pressureHpa:
          typeof point.pressure_hpa === "number" ? point.pressure_hpa : NaN,
      };
    });
  }, [forecast]);
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    // SSR とブラウザで時刻/タイムゾーンがズレると hydration mismatch になるため、
    // 現在時刻の確定はクライアント側で行う。
    setCurrentHour(new Date().getHours());
  }, []);

  // PC用: 横スクロール（コンテナ内のみ）
  useEffect(() => {
    if (currentHour == null) return;
    const container = scrollRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(
      `[data-row="time"][data-hour="${currentHour}"]`
    );

    if (target) {
      const targetCenter = target.offsetLeft + target.offsetWidth / 2;
      container.scrollLeft = targetCenter - container.clientWidth / 2;
      return;
    }

    container.scrollLeft = Math.max(0, currentHour * DEFAULT_CELL_W - DEFAULT_CELL_W * 3);
  }, [currentHour]);

  // モバイル用: 縦スクロール（コンテナ内のみ）
  useEffect(() => {
    if (currentHour == null) return;
    const container = mobileScrollRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(
      `[data-mobile-hour="${currentHour}"]`
    );

    if (target) {
      const targetCenter = target.offsetTop + target.offsetHeight / 2;
      container.scrollTop = targetCenter - container.clientHeight / 2;
    }
  }, [currentHour]);

  return (
    <ForecastTable
      forecast={hourForecast}
      currentHour={currentHour}
      scrollContainerRef={scrollRef}
      mobileScrollContainerRef={mobileScrollRef}
    />
  );
}

