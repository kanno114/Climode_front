import type React from "react";
import { Thermometer, Heart, Bell } from "lucide-react";

export type StepKey = "prefecture" | "concern_topics" | "notification";

export type StepDefinition = {
  key: StepKey;
  title: string;
  description: string;
  subtitle: string;
  required: boolean;
  tutorial: React.ReactNode;
  icon: React.ElementType;
};

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    key: "prefecture",
    title: "地域に合わせた提案を受け取る",
    description:
      "地域の気象データをもとに、あなたの体調に合った提案をお届けします。",
    subtitle: "ステップ1: あなたの地域を設定しましょう",
    required: true,
    icon: Thermometer,
    tutorial: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          気圧や温度の変化など、地域ごとの環境データをもとに提案を受け取るために、
          まずは「取得地域（都道府県）」を設定します。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>ダッシュボードで毎朝更新された提案を確認できます</li>
          <li>地域に合わせたアドバイスで無理のない過ごし方を提案</li>
        </ul>
        <p className="pt-2">
          あとから設定ページでも変更できますが、最初に登録しておくと提案がスムーズです。
        </p>
      </div>
    ),
  },
  {
    key: "concern_topics",
    title: "関心ワードを登録する",
    description:
      "気になる体調・環境を選ぶと、よりあなたに合った提案をお届けします。",
    subtitle: "ステップ2: 気になる項目を選びましょう",
    required: false,
    icon: Heart,
    tutorial: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          熱中症、ヒートショック、気象病、乾燥・感染リスク、睡眠時間など、
          あなたが気になりそうな項目を選びます。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>選んだ項目に合わせた行動提案を優先的に表示</li>
          <li>気になることがなければ選ばなくても大丈夫です</li>
        </ul>
        <p className="pt-2">あとから関心ワードページでいつでも変更できます。</p>
      </div>
    ),
  },
  {
    key: "notification",
    title: "通知でリズムを整える",
    description: "朝と夜のやさしいリマインドで、振り返りを自然な習慣にします。",
    subtitle: "ステップ3: 通知で習慣をサポートしましょう",
    required: false,
    icon: Bell,
    tutorial: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          通知を有効にすると、朝8時は行動提案、夜20時は振り返りのリマインドが届きます。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>朝8時：今日の行動提案</li>
          <li>夜20時：1分で終わる振り返りフォームへのご案内</li>
        </ul>
        <p className="pt-2">
          通知は設定からいつでも有効/無効に変更できます。不調な日でも負担にならない頻度で届けます。
        </p>
      </div>
    ),
  },
];
