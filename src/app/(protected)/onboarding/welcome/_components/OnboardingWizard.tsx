"use client";

import type { Trigger } from "@/lib/schemas/triggers";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TutorialPanel } from "./TutorialPanel";
import { PrefectureStep } from "./steps/PrefectureStep";
import { TriggerStep } from "./steps/TriggerStep";
import { NotificationStep } from "./steps/NotificationStep";
import { STEP_DEFINITIONS } from "./onboarding-steps.config";
import { useOnboardingWizard } from "./hooks/useOnboardingWizard";

type PrefectureOption = {
  id: number;
  code: string;
  name_ja: string;
};

type OnboardingWizardProps = {
  prefectures: PrefectureOption[];
  initialPrefectureId?: number | null;
  triggerPresets: Trigger[];
  initialSelectedTriggerKeys: string[];
};

export function OnboardingWizard({
  prefectures,
  initialPrefectureId,
  triggerPresets,
  initialSelectedTriggerKeys,
}: OnboardingWizardProps) {
  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    progress,
    handleGoBack,
    handleStepComplete,
    handleStepSkip,
  } = useOnboardingWizard({
    initialPrefectureCompleted: Boolean(initialPrefectureId),
    initialTriggerCompleted: initialSelectedTriggerKeys.length > 0,
  });

  const formContent = (() => {
    switch (currentStep.key) {
      case "prefecture":
        return (
          <PrefectureStep
            prefectures={prefectures}
            initialPrefectureId={initialPrefectureId}
            onComplete={() => handleStepComplete("prefecture")}
          />
        );
      case "trigger":
        return (
          <TriggerStep
            triggerPresets={triggerPresets}
            initialSelectedKeys={initialSelectedTriggerKeys}
            onComplete={() => handleStepComplete("trigger")}
            onSkip={() => handleStepSkip("trigger")}
          />
        );
      case "notification":
        return (
          <NotificationStep
            onComplete={() => handleStepComplete("notification")}
            onSkip={() => handleStepSkip("notification")}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <Card className="shadow-xl border-primary/10">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl mt-1">{currentStep.title}</CardTitle>
            <CardDescription className="mt-2">
              {currentStep.description}
            </CardDescription>
          </div>
          <div className="w-full md:w-60">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>進捗</span>
              <span>
                ステップ {currentStepIndex + 1} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <TutorialPanel
            icon={currentStep.icon}
            title={currentStep.title}
            content={currentStep.tutorial}
          />
          {formContent}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-2">
            {STEP_DEFINITIONS.map((step, index) => {
              const Icon = step.icon;
              const active = index === currentStepIndex;
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGoBack}
              disabled={currentStepIndex === 0}
            >
              前のステップへ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
