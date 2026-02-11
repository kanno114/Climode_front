"use client";

import { ExternalLink } from "lucide-react";

// メトリクスキー → 日本語ラベル・単位
const METRIC_LABEL_MAP: Record<string, { label: string; unit: string }> = {
  temperature_c: { label: "気温", unit: "℃" },
  min_temperature_c: { label: "最低気温", unit: "℃" },
  humidity_pct: { label: "湿度", unit: "%" },
  pressure_hpa: { label: "気圧", unit: "hPa" },
  sleep_hours: { label: "睡眠時間", unit: "時間" },
  mood: { label: "気分", unit: "（1〜5）" },
  fatigue: { label: "疲労度", unit: "（1〜5）" },
  max_pressure_drop_1h_awake: { label: "1時間最大気圧低下", unit: "hPa" },
  low_pressure_duration_1003h: { label: "1003hPa以下の持続時間", unit: "時間" },
  low_pressure_duration_1007h: { label: "1007hPa以下の持続時間", unit: "時間" },
  pressure_range_3h_awake: { label: "3時間気圧レンジ", unit: "hPa" },
  pressure_jitter_3h_awake: { label: "3時間気圧ジッター", unit: "-" },
};

function formatMetricKey(key: string): string {
  return key.replace(/_/g, " ");
}

function formatValue(value: number | string, unit: string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return `${value}`;
  if (unit === "-" || unit === "（1〜5）") return `${value}`;
  return `${value}${unit}`;
}

// URLを抽出してリンク化
function linkifyText(text: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s\)]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary underline hover:no-underline"
        >
          {part}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      );
    }
    return part;
  });
}

interface SuggestionEvidenceProps {
  triggers?: Record<string, number | string> | null;
  reason_text?: string | null;
  evidence_text?: string | null;
}

export function SuggestionEvidence({
  triggers,
  reason_text,
  evidence_text,
}: SuggestionEvidenceProps) {
  const hasTriggers =
    triggers &&
    typeof triggers === "object" &&
    Object.keys(triggers).length > 0;
  const hasReason = reason_text && reason_text.trim().length > 0;
  const hasEvidence = evidence_text && evidence_text.trim().length > 0;

  if (!hasTriggers && !hasReason && !hasEvidence) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3 border-t pt-3 text-sm">
      {hasTriggers && (
        <div>
          <h5 className="mb-1 font-medium text-gray-700 dark:text-gray-300">
            根拠となったデータ
          </h5>
          <ul className="list-inside list-disc space-y-0.5 text-gray-600 dark:text-gray-400">
            {Object.entries(triggers || {}).map(([key, value]) => {
              const config = METRIC_LABEL_MAP[key] || {
                label: formatMetricKey(key),
                unit: "",
              };
              return (
                <li key={key}>
                  {config.label}: {formatValue(value, config.unit)}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {hasReason && (
        <div>
          <h5 className="mb-1 font-medium text-gray-700 dark:text-gray-300">
            なぜその提案が出たか
          </h5>
          <p className="text-gray-600 dark:text-gray-400">{reason_text}</p>
        </div>
      )}

      {hasEvidence && (
        <div>
          <h5 className="mb-1 font-medium text-gray-700 dark:text-gray-300">
            そのエビデンス
          </h5>
          <p className="text-gray-600 dark:text-gray-400">
            {linkifyText(evidence_text)}
          </p>
        </div>
      )}
    </div>
  );
}
