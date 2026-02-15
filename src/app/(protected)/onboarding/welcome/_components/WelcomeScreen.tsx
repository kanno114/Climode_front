"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Thermometer, Heart, Bell } from "lucide-react";

type WelcomeScreenProps = {
  onStart: () => void;
};

const features = [
  {
    icon: Thermometer,
    title: "地域に合わせた提案",
    description:
      "気圧や気温の変化をもとに、あなたの体調に合ったアドバイスをお届けします。",
  },
  {
    icon: Heart,
    title: "あなたの関心に合わせて",
    description:
      "気になる体調・環境を選ぶと、よりパーソナライズされた提案を受け取れます。",
  },
  {
    icon: Bell,
    title: "やさしいリマインド",
    description:
      "朝は行動提案、夜は振り返り。無理のないリズムで習慣をサポートします。",
  },
];

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <Card className="shadow-xl border-primary/10">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl">ようこそClimodeへ</CardTitle>
        <p className="text-muted-foreground mt-2">
          あなたの体調と環境の関係を見つけ、毎日をもっと快適に過ごしましょう。
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border bg-muted/30 p-4 text-center space-y-2"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        <Button className="w-full" size="lg" onClick={onStart}>
          はじめる
        </Button>
      </CardContent>
    </Card>
  );
}
