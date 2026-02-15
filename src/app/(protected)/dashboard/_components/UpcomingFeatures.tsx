const upcomingFeatures = [
  { label: "体調予測機能", description: "1日のリズムから先読み" },
  { label: "SNS共有機能", description: "気づきを家族とシェア" },
  {
    label: "カスタムトリガー設定",
    description: "自分に合った体調のトリガーを登録",
  },
];

export function UpcomingFeatures() {
  return (
    <div className="px-1">
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-2">今後の機能予定</p>
        <div className="flex flex-col gap-1.5">
        {upcomingFeatures.map((feature) => (
          <div
            key={feature.label}
            className="flex items-baseline gap-2 text-xs text-slate-600 dark:text-slate-400"
          >
            <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
              {feature.label}
            </span>
            <span className="text-muted-foreground">— {feature.description}</span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
