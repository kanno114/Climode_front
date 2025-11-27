import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Moon, Calendar, TrendingUp, Heart } from "lucide-react";

export function AppDescription() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* サービス概要 */}
      <Card className="bg-white/80 dark:bg-slate-900/40">
        <CardHeader>
          <CardTitle className="text-2xl">Climodeについて</CardTitle>
          <CardDescription className="text-base">
            体調のゆらぎを「シグナル」として見える化する健康管理アプリ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Climode</strong>
            は、睡眠・気分・症状などの身体データと、天気・気圧・湿度などの環境データを統合して、
            体調のゆらぎを「シグナル」（体調に影響を与える可能性のある変化のサイン）として見える化する健康管理アプリです。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            朝に「今日のシグナル」（体調に影響する可能性のある環境や身体の変化）を確認し、夜にその日の体調を振り返る。
            この1日2回の軽いリズムを通じて、「頑張る」ではなく「整える」ための習慣をつくります。
          </p>
        </CardContent>
      </Card>

      {/* 主な機能 */}
      <Card className="bg-white/80 dark:bg-slate-900/40">
        <CardHeader>
          <CardTitle className="text-2xl">主な機能</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">シグナル判定</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  気圧・湿度・気温などの環境変化と、あなたが登録したトリガーをもとに、体調に影響する可能性のある変化（シグナル）を自動で判定します。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">体調記録</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  睡眠・気分・症状などを簡単に記録。数秒で入力できるシンプルなUIで、無理なく続けられます。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">振り返り機能</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  週単位で体調と環境の関係を振り返り、自分のリズムを理解できるようになります。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Sun className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">行動提案</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  体調に影響する可能性のある変化（シグナル）と体調データをもとに、その日に合った行動提案を自動で生成します。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 使い方 */}
      <Card className="bg-white/80 dark:bg-slate-900/40">
        <CardHeader>
          <CardTitle className="text-2xl">使い方</CardTitle>
          <CardDescription className="text-base">
            朝と夜の2回だけのシンプルなリズム
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 朝 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Sun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">朝</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                  <li>
                    通知で「今日のシグナル」（体調に影響する可能性のある変化）を確認
                  </li>
                  <li>必要に応じて、睡眠・気分・疲労感などを簡単に入力</li>
                  <li>
                    シグナルに基づいた行動提案を確認して、その日のリズムを整える
                  </li>
                </ul>
              </div>
            </div>

            {/* 夜 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Moon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">夜</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                  <li>通知から振り返り画面へ遷移</li>
                  <li>その日を振り返って記録</li>
                  <li>
                    当日の環境データや体調に影響する可能性のある変化（シグナル）と照合し、翌週の傾向レポートに反映
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
