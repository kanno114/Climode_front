"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Thermometer,
  Calendar,
  BarChart3,
  Bell,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  {
    title: "シグナルで体調の変化を知る",
    description:
      "気圧や温度の変化、睡眠不足など、あなたの体調に影響する要素を「シグナル」として検出します。",
    icon: Thermometer,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          朝になると、今日の体調に影響を与える可能性のあるシグナルが表示されます。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>気圧低下や温度変化などの環境シグナル</li>
          <li>睡眠不足や疲労感などの体調シグナル</li>
        </ul>
        <p className="pt-2">
          シグナルに基づいて、その日の過ごし方の提案も受けられます。
        </p>
      </div>
    ),
  },
  {
    title: "日々の記録をつける",
    description:
      "朝と夜に簡単な入力をするだけで、あなたの体調データを記録できます。",
    icon: Calendar,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>毎日の体調を記録して、データを蓄積しましょう。</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>朝：睡眠時間、気分、疲労感を入力</li>
          <li>夜：その日の体調や気づきを記録</li>
        </ul>
        <p className="pt-2">
          記録を続けることで、体調のパターンが見えてきます。
        </p>
      </div>
    ),
  },
  {
    title: "週間レポートで振り返る",
    description:
      "週単位で体調の変化を振り返り、環境との関係を理解しましょう。",
    icon: BarChart3,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>1週間の記録をまとめて、体調の傾向を確認できます。</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>体調スコアの推移グラフ</li>
          <li>天気と体調の相関関係</li>
          <li>シグナル発生の傾向</li>
        </ul>
        <p className="pt-2">
          「どんな気候のときに不調を感じやすいか」など、気づきを得られます。
        </p>
      </div>
    ),
  },
  {
    title: "通知でリマインド",
    description:
      "朝と夜の2回だけ、優しい通知で記録を促します。",
    icon: Bell,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          プッシュ通知を設定すると、記録を忘れることなく続けられます。
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>朝：今日のシグナルと記録のお知らせ</li>
          <li>夜：振り返り記録のお知らせ</li>
        </ul>
        <p className="pt-2">
          無理せず、自然に続けられるリズムをサポートします。
        </p>
      </div>
    ),
  },
];

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const IconComponent = step.icon;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
              <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription className="mt-1">{step.description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="min-h-[150px]">{step.content}</div>

        {/* プログレスバー */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ステップ {currentStep + 1} / {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                次へ
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
                はじめる
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

