import type React from "react";
import { Thermometer, Calendar, Bell } from "lucide-react";

export type StepKey = "prefecture" | "trigger" | "notification";

export type StepDefinition = {
  key: StepKey;
  title: string;
  description: string;
  required: boolean;
  tutorial: React.ReactNode;
  icon: React.ElementType;
};

export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    key: "prefecture",
    title: "シグナルで体調の変化を知る",
    description:
      "地域の気象データをもとに、あなたの体調に影響するシグナルを検出します。",
    required: true,
    icon: Thermometer,
    tutorial: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          気圧や温度の変化など、地域ごとの環境シグナルを取得するために、
          まずは「取得地域（都道府県）」を設定します。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>環境データを組み合わせたシグナルが毎朝7時に届きます</li>
          <li>地域に合わせたアドバイスで無理のない過ごし方を提案</li>
        </ul>
        <p className="pt-2">
          あとから設定ページでも変更できますが、最初に登録しておくと提案がスムーズです。
        </p>
      </div>
    ),
  },
  {
    key: "trigger",
    title: "気になるトリガーを選ぶ",
    description:
      "身体や環境の「ゆらぎ」をトリガーとして登録すると、通知や提案が自分用になります。",
    required: false,
    icon: Calendar,
    tutorial: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          「気圧の低下」「寝不足」など、体調に影響しやすい要因をトリガーとして登録できます。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>当てはまるものを選ぶほど、シグナルの精度が上がります</li>
          <li>あなたに合わせたパーソナライズされた通知や提案を受け取れます</li>
          <li>
            登録したトリガーに基づいて、体調管理のアドバイスがより的確になります
          </li>
          <li>あとから何度でも追加・削除が可能です</li>
        </ul>
        <p className="pt-2">
          まだ分からない場合はスキップしても大丈夫。慣れてきたら設定してみましょう。
        </p>
      </div>
    ),
  },
  {
    key: "notification",
    title: "通知でリズムを整える",
    description: "朝と夜のやさしいリマインドで、振り返りを自然な習慣にします。",
    required: false,
    icon: Bell,
    tutorial: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          通知を有効にすると、朝7時はシグナルのお知らせ、夜20時は振り返りのリマインドが届きます。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>朝7時：今日のシグナルと行動のヒント</li>
          <li>夜20時：1分で終わる振り返りフォームへのご案内</li>
        </ul>
        <p className="pt-2">
          通知は設定からいつでも有効/無効に変更できます。不調な日でも負担にならない頻度で届けます。
        </p>
      </div>
    ),
  },
];
