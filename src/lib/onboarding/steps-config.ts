import type React from "react";
import { Thermometer, Heart, Bell } from "lucide-react";

export type StepKey = "prefecture" | "concern_topics" | "notification";

export type StepDefinition = {
  key: StepKey;
  title: string;
  description: string;
  subtitle: string;
  required: boolean;
  tutorialKey: StepKey;
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
    tutorialKey: "prefecture",
  },
  {
    key: "concern_topics",
    title: "関心トピックを登録する",
    description:
      "気になる体調・環境を選ぶと、よりあなたに合った提案をお届けします。",
    subtitle: "ステップ2: 気になる項目を選びましょう",
    required: false,
    icon: Heart,
    tutorialKey: "concern_topics",
  },
  {
    key: "notification",
    title: "通知でリズムを整える",
    description: "朝と夜のやさしいリマインドで、振り返りを自然な習慣にします。",
    subtitle: "ステップ3: 通知で習慣をサポートしましょう",
    required: false,
    icon: Bell,
    tutorialKey: "notification",
  },
];
