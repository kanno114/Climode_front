"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

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
    <div className="space-y-4 text-sm">
      {hasTriggers && (
        <section>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            根拠となったデータ
          </h5>
          <div className="rounded-md bg-muted/50 p-3">
            <dl className="grid gap-2 sm:grid-cols-1">
              {Object.entries(triggers || {}).map(([key, value]) => {
                const config = METRIC_LABEL_MAP[key] || {
                  label: formatMetricKey(key),
                  unit: "",
                };
                return (
                  <div key={key} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{config.label}</dt>
                    <dd className="font-medium tabular-nums">
                      {formatValue(value, config.unit)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>
      )}

      {hasReason && (
        <section>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            判定理由
          </h5>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            {reason_text}
          </p>
        </section>
      )}

      {hasEvidence && (
        <section>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            参考文献・出典
          </h5>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            <BookOpen className="h-3.5 w-3.5" />
            詳しいエビデンスはこちら
          </Link>
        </section>
      )}
    </div>
  );
}
