import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="border-dashed border-slate-200 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
      <CardHeader>
        <CardTitle className="text-xl">今後の機能予定</CardTitle>
        <CardDescription>
          現在開発中のアップデートを先行でご紹介します
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {upcomingFeatures.map((feature) => (
          <div
            key={feature.label}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              {feature.label}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {feature.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
