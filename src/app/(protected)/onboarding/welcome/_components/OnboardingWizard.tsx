"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
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
import { ConcernTopicsStep } from "./steps/ConcernTopicsStep";
import { NotificationStep } from "./steps/NotificationStep";
import { WelcomeScreen } from "./WelcomeScreen";
import { CompletionScreen } from "./CompletionScreen";
import { STEP_DEFINITIONS } from "@/lib/onboarding/steps-config";
import { useOnboardingWizard } from "@/hooks/use-onboarding-wizard";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";

type PrefectureOption = {
  id: number;
  code: string;
  name_ja: string;
};

type OnboardingWizardProps = {
  prefectures: PrefectureOption[];
  initialPrefectureId?: number | null;
  concernTopics: ConcernTopic[];
  initialSelectedKeys: string[];
};

export function OnboardingWizard({
  prefectures,
  initialPrefectureId,
  concernTopics,
  initialSelectedKeys,
}: OnboardingWizardProps) {
  const {
    phase,
    currentStepIndex,
    currentStep,
    totalSteps,
    progress,
    stepCompletion,
    skippedSteps,
    handleStartOnboarding,
    handleStepComplete,
    handleStepSkip,
    handleGoBack,
    handleGoToStep,
    handleGoToDashboard,
  } = useOnboardingWizard({
    initialPrefectureCompleted: Boolean(initialPrefectureId),
  });

  const [selectedPrefectureId, setSelectedPrefectureId] = useState<
    number | null
  >(initialPrefectureId ?? null);
  const [concernTopicsCount, setConcernTopicsCount] = useState(
    initialSelectedKeys.length
  );

  // Step transition animation
  const [displayedStepIndex, setDisplayedStepIndex] = useState(currentStepIndex);
  const [animationClass, setAnimationClass] = useState("step-enter-active");

  useEffect(() => {
    if (currentStepIndex === displayedStepIndex) return;

    const isForward = currentStepIndex > displayedStepIndex;
    setAnimationClass(isForward ? "step-exit-to-left" : "step-exit-to-right");

    const timeout = setTimeout(() => {
      setDisplayedStepIndex(currentStepIndex);
      setAnimationClass(
        isForward ? "step-enter-from-right" : "step-enter-from-left"
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationClass("step-enter-active");
        });
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [currentStepIndex, displayedStepIndex]);

  const displayedStep = STEP_DEFINITIONS[displayedStepIndex];

  if (phase === "welcome") {
    return <WelcomeScreen onStart={handleStartOnboarding} />;
  }

  if (phase === "complete") {
    const prefectureName =
      prefectures.find((p) => p.id === selectedPrefectureId)?.name_ja ?? null;
    const notificationEnabled =
      stepCompletion.notification && !skippedSteps.notification;

    return (
      <CompletionScreen
        prefectureName={prefectureName}
        concernTopicsCount={concernTopicsCount}
        notificationEnabled={notificationEnabled}
        onGoToDashboard={handleGoToDashboard}
      />
    );
  }

  const formContent = (() => {
    switch (displayedStep.key) {
      case "prefecture":
        return (
          <PrefectureStep
            prefectures={prefectures}
            initialPrefectureId={initialPrefectureId}
            onComplete={(prefectureId?: number) => {
              if (prefectureId) {
                setSelectedPrefectureId(prefectureId);
              }
              handleStepComplete("prefecture");
            }}
          />
        );
      case "concern_topics":
        return (
          <ConcernTopicsStep
            topics={concernTopics}
            initialSelectedKeys={initialSelectedKeys}
            onComplete={(count?: number) => {
              if (count !== undefined) {
                setConcernTopicsCount(count);
              }
              handleStepComplete("concern_topics");
            }}
            onSkip={() => handleStepSkip("concern_topics")}
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
        <div className={animationClass}>
          <div className="grid gap-6 lg:grid-cols-2">
            <details className="lg:hidden group" open>
              <summary className="flex items-center gap-2 text-sm font-medium cursor-pointer py-2 list-none [&::-webkit-details-marker]:hidden">
                <displayedStep.icon className="h-4 w-4 text-primary" />
                <span>ガイドを表示</span>
                <span className="ml-auto text-muted-foreground text-xs group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <TutorialPanel
                icon={displayedStep.icon}
                title={displayedStep.title}
                subtitle={displayedStep.subtitle}
                content={displayedStep.tutorial}
              />
            </details>
            <div className="hidden lg:block">
              <TutorialPanel
                icon={displayedStep.icon}
                title={displayedStep.title}
                subtitle={displayedStep.subtitle}
                content={displayedStep.tutorial}
              />
            </div>
            {formContent}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-2">
            {STEP_DEFINITIONS.map((step, index) => {
              const Icon = step.icon;
              const active = index === currentStepIndex;
              const completed = stepCompletion[step.key];
              const clickable = completed && !active;

              return (
                <button
                  type="button"
                  key={step.key}
                  onClick={() => clickable && handleGoToStep(index)}
                  disabled={!clickable}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : completed
                        ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 cursor-pointer hover:bg-green-500/20"
                        : "border-muted text-muted-foreground"
                  } ${!clickable && !active ? "cursor-default" : ""}`}
                >
                  {completed && !active ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
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
