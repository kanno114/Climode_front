import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Heart,
  Zap,
  Calendar,
  TrendingUp,
  CloudSun,
  Bed,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { EVIDENCE_CATEGORIES } from "./_data/evidence-sources";

export const metadata: Metadata = {
  title: "Climodeについて",
  description:
    "Climodeは天気・気圧などの環境データと睡眠・気分・疲労などの体調データを掛け合わせ、毎朝のシグナルと提案を届けるヘルスケアアプリです。",
};

const FEATURES = [
  {
    icon: Zap,
    title: "今日の提案",
    description:
      "毎朝、気象条件とあなたの体調傾向から、その日に気をつけるべきポイントを提案します。",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Heart,
    title: "体調トラッキング",
    description:
      "睡眠時間・気分・疲労度を毎日記録。シンプルな入力で継続しやすい設計です。",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Calendar,
    title: "振り返り・レポート",
    description:
      "カレンダー形式で体調の推移を一覧し、週次レポートで傾向を把握できます。",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: TrendingUp,
    title: "相関分析",
    description:
      "環境データと体調データの相関を分析し、あなた固有のパターンを発見します。",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        {/* サービス概要 */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Climodeについて
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            体調の「ゆらぎ」に、今日の提案を届ける
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Climodeは、天気・気圧などの環境データと、睡眠・気分・疲労などの体調データを掛け合わせて分析し、毎朝あなたに合った提案を届けるヘルスケアアプリです。
          </p>
        </section>

        {/* 主な機能 */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
            主な機能
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-2 ${feature.bg}`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 仕組み */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
            Climodeの仕組み
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                  <CloudSun className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    環境データ
                  </span>
                </div>
                <span className="text-gray-400 text-lg font-bold">×</span>
                <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    体調データ
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 hidden sm:block" />
                <span className="text-gray-400 text-lg font-bold sm:hidden">
                  ↓
                </span>
                <div className="flex items-center gap-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 px-4 py-3">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    シグナル・提案
                  </span>
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <CloudSun className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                  <p>
                    <span className="font-medium text-gray-900 dark:text-white">
                      環境データ
                    </span>
                    ：気温・湿度・気圧・天候などをOpen-Meteo
                    APIから自動取得し、気圧変化や暑さ指数を算出します。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Bed className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                  <p>
                    <span className="font-medium text-gray-900 dark:text-white">
                      体調データ
                    </span>
                    ：毎日記録する睡眠時間・気分・疲労度をもとに、あなたの体調傾向を把握します。
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-4 w-4 mt-0.5 shrink-0 text-purple-500" />
                  <p>
                    <span className="font-medium text-gray-900 dark:text-white">
                      シグナル・提案
                    </span>
                    ：環境と体調の組み合わせから、各種エビデンスを参考にしたルールエンジンがその日のリスクと対策を生成します。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 免責事項 */}
        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>必ずお読みください</AlertTitle>
          <AlertDescription>
            本サービスの提案は、健康管理の目安として提供するものであり、医療行為や医師の診断を代替するものではありません。体調に異変を感じた場合は、専門機関にご相談ください。
          </AlertDescription>
        </Alert>

        {/* エビデンス */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
            参照エビデンス
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Climodeでは、以下の公的機関のデータ、学術研究、専門家の知見を参考に、独自のアルゴリズムで解析・提案を行っています。
          </p>
          <div className="space-y-6">
            {EVIDENCE_CATEGORIES.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <p className="text-sm text-muted-foreground font-normal">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.sources.map((source, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {source.name}
                      </p>
                      {source.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {source.description}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="pt-4 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
