import { TrendingUp, Heart, Calendar, Sun } from "lucide-react";
import { FadeInOnScroll } from "./FadeInOnScroll";

const features = [
  {
    icon: TrendingUp,
    title: "今日の提案",
    description:
      "気圧・気温・湿度などの環境データと、あなたの体調入力をもとに、その日に合った行動提案を自動で生成します。",
    color: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Heart,
    title: "体調記録",
    description:
      "睡眠時間・気分・疲労感を簡単に記録。数秒で入力できるシンプルなUIで、無理なく続けられます。",
    color: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Calendar,
    title: "振り返りとレポート",
    description:
      "夜に提案へのフィードバックとセルフスコアを記録。週次レポートで体調の傾向や相関を把握できます。",
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Sun,
    title: "関心トピック",
    description:
      "自分が気になる健康テーマを登録すると、関連する提案だけが届くようになります。",
    color: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">主な機能</h2>
            <p className="text-muted-foreground text-lg">
              体調管理をシンプルに、スマートに
            </p>
          </div>
        </FadeInOnScroll>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <FadeInOnScroll key={feature.title}>
              <div className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}
                >
                  <feature.icon
                    className={`h-6 w-6 ${feature.iconColor}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
