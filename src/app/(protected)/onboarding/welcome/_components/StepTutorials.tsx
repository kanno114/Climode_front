import type React from "react";
import type { StepKey } from "@/lib/onboarding/steps-config";

const STEP_TUTORIALS: Record<StepKey, React.ReactNode> = {
  prefecture: (
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
  concern_topics: (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>
        熱中症、ヒートショック、気象病、乾燥・感染リスク、睡眠時間など、
        あなたが気になりそうな項目を選びます。
      </p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>選んだ項目に合わせた行動提案を優先的に表示</li>
        <li>気になることがなければ選ばなくても大丈夫です</li>
      </ul>
      <p className="pt-2">あとから関心トピックページでいつでも変更できます。</p>
    </div>
  ),
  notification: (
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
  theme: (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>
        アプリの外観をお好みに合わせて選べます。選択するとすぐにプレビューされます。
      </p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>ライト：明るい背景で見やすい表示</li>
        <li>ダーク：目に優しい暗めの表示</li>
        <li>システム：端末の設定に自動で合わせる</li>
      </ul>
      <p className="pt-2">
        あとから設定ページでいつでも変更できます。
      </p>
    </div>
  ),
};

export function getStepTutorial(key: StepKey): React.ReactNode {
  return STEP_TUTORIALS[key];
}
