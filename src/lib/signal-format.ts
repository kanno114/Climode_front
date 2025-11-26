/**
 * シグナル関連のフォーマット関数
 */

// メタテキストを抽出
export function extractMetaText(meta?: Record<string, unknown> | null) {
  if (!meta) return null;
  if (typeof meta.comment === "string") return meta.comment;
  if (typeof meta.summary === "string") return meta.summary;
  return null;
}

// メトリック名を日本語に変換
export function formatMetric(metric: string): string {
  const metricMap: Record<string, string> = {
    pressure_drop_6h: "6時間気圧変化",
    pressure_drop_24h: "24時間気圧変化",
    temperature_drop_6h: "6時間気温変化",
    temperature_drop_12h: "12時間気温変化",
    temperature_c: "気温",
    humidity_pct: "湿度",
    humidity_avg: "平均湿度",
    pressure_hpa: "気圧",
    sleep_hours: "睡眠時間",
    mood: "気分",
    score: "体調スコア",
  };
  return metricMap[metric] || metric;
}

// 単位を取得
export function getUnit(metric: string): string {
  if (metric.includes("pressure") || metric.includes("hpa")) return "hPa";
  if (metric.includes("temperature") || metric.includes("_c")) return "℃";
  if (metric.includes("humidity") || metric.includes("pct")) return "%";
  if (metric.includes("sleep_hours")) return "時間";
  if (metric === "mood" || metric === "score") return "点";
  return "";
}

// 観測値を自然な文章形式でフォーマット
export function formatObservedValue(
  meta?: Record<string, unknown> | null
): string | null {
  if (!meta) return null;

  // observedを数値に変換（文字列の場合も対応）
  const observed =
    typeof meta.observed === "number"
      ? meta.observed
      : typeof meta.observed === "string"
        ? parseFloat(meta.observed)
        : null;

  if (observed === null || isNaN(observed)) return null;

  const threshold =
    typeof meta.threshold === "number"
      ? meta.threshold
      : typeof meta.threshold === "string"
        ? parseFloat(meta.threshold)
        : null;
  const metric = typeof meta.metric === "string" ? meta.metric : null;
  const operator = typeof meta.operator === "string" ? meta.operator : null;

  if (!metric) return null;

  const metricLabel = formatMetric(metric);
  const unit = getUnit(metric);

  // 変化系メトリック（気圧変化、気温変化など）
  const isChangeMetric = metric.includes("drop") || metric.includes("change");

  if (isChangeMetric) {
    const isNegative = observed < 0;
    const absValue = Math.abs(observed);
    const direction = isNegative ? "下がりました" : "上がりました";

    if (threshold !== null && operator) {
      // 演算子に応じた判定文
      let judgment = "";
      if (operator === "lte" && observed <= threshold) {
        judgment = `これは注意レベルの閾値(${threshold}${unit})を下回っています。`;
      } else if (operator === "gte" && observed >= threshold) {
        judgment = `これは注意レベルの閾値(${threshold}${unit})を上回っています。`;
      } else if (operator === "lt" && observed < threshold) {
        judgment = `これは注意レベルの閾値(${threshold}${unit})未満です。`;
      } else if (operator === "gt" && observed > threshold) {
        judgment = `これは注意レベルの閾値(${threshold}${unit})より大きいです。`;
      }

      return `${metricLabel}が${absValue}${unit}${direction}。${judgment}`;
    }

    return `${metricLabel}が${absValue}${unit}${direction}。`;
  }

  // 値系メトリック（睡眠時間、気分、体調スコアなど）
  if (threshold !== null && operator) {
    let judgment = "";
    if (operator === "lte" && observed <= threshold) {
      judgment = `これは注意レベルの閾値(${threshold}${unit}以下)を下回っています。`;
    } else if (operator === "gte" && observed >= threshold) {
      judgment = `これは注意レベルの閾値(${threshold}${unit}以上)を上回っています。`;
    } else if (operator === "lt" && observed < threshold) {
      judgment = `これは注意レベルの閾値(${threshold}${unit}未満)です。`;
    } else if (operator === "gt" && observed > threshold) {
      judgment = `これは注意レベルの閾値(${threshold}${unit})より大きいです。`;
    }

    return `${metricLabel}が${observed}${unit}でした。${judgment}`;
  }

  return `${metricLabel}が${observed}${unit}でした。`;
}

