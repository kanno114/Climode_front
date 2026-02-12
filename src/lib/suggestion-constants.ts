/**
 * 提案（Suggestion）関連の共通定数
 */

// tag → 日本語ラベル
export const TAG_LABELS: Record<string, string> = {
  temperature: "気温",
  heatstroke: "熱中症",
  heat_shock: "ヒートショック",
  pressure: "気圧",
  weather_pain: "気象病",
  humidity: "湿度",
  dryness_infection: "乾燥・感染",
  sleep: "睡眠",
  rest: "休息",
  positive: "良好",
  cold: "寒さ",
};

export function getTagLabel(tag: string | null | undefined): string {
  if (!tag) return "";
  return TAG_LABELS[tag] ?? tag;
}

// level → 日本語ラベル
export const LEVEL_LABELS: Record<string, string> = {
  Danger: "危険",
  Warning: "注意",
  Caution: "やや注意",
  Notice: "注意",
  Optimal: "良好",
  Good: "良好",
  Temperature: "快適",
  Humidity: "快適",
  Pressure: "安定",
};

// level → 色（Tailwind classes）
export const LEVEL_COLOR_MAP: Record<
  string,
  { color: string; bgColor: string; borderColor: string; cardBgColor: string }
> = {
  Danger: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    cardBgColor: "bg-red-50",
  },
  Warning: {
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
    cardBgColor: "bg-orange-50",
  },
  Caution: {
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    cardBgColor: "bg-yellow-50",
  },
  Notice: {
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    cardBgColor: "bg-amber-50",
  },
  Optimal: {
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    cardBgColor: "bg-green-50",
  },
  Good: {
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    cardBgColor: "bg-green-50",
  },
  Temperature: {
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
    cardBgColor: "bg-teal-50",
  },
  Humidity: {
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
    cardBgColor: "bg-teal-50",
  },
  Pressure: {
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
    cardBgColor: "bg-teal-50",
  },
};

/** Chart.js用のlevel別色（RGBA） */
export const LEVEL_CHART_COLORS: Record<string, string> = {
  Danger: "rgba(239, 68, 68, 0.8)",
  Warning: "rgba(249, 115, 22, 0.8)",
  Caution: "rgba(234, 179, 8, 0.8)",
  Notice: "rgba(245, 158, 11, 0.8)",
  Optimal: "rgba(34, 197, 94, 0.8)",
  Good: "rgba(34, 197, 94, 0.8)",
  Temperature: "rgba(20, 184, 166, 0.8)",
  Humidity: "rgba(20, 184, 166, 0.8)",
  Pressure: "rgba(20, 184, 166, 0.8)",
};

const LEVEL_DEFAULT = {
  color: "text-slate-700",
  bgColor: "bg-slate-100",
  borderColor: "border-slate-200",
  cardBgColor: "bg-slate-50",
};

export function getLevelStyle(level: string | null | undefined) {
  if (!level) return LEVEL_DEFAULT;
  return LEVEL_COLOR_MAP[level] ?? LEVEL_DEFAULT;
}

export function getLevelLabel(level: string | null | undefined): string {
  if (!level) return "";
  return LEVEL_LABELS[level] ?? level;
}
