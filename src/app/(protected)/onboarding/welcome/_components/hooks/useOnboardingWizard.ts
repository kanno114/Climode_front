"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STEP_DEFINITIONS, type StepKey } from "../onboarding-steps.config";

type StepCompletion = Record<StepKey, boolean>;
type SkippedSteps = Partial<Record<StepKey, boolean>>;
type WizardPhase = "welcome" | "steps" | "complete";

type UseOnboardingWizardOptions = {
  initialPrefectureCompleted: boolean;
};

export function useOnboardingWizard({
  initialPrefectureCompleted,
}: UseOnboardingWizardOptions) {
  const router = useRouter();

  const [phase, setPhase] = useState<WizardPhase>(
    initialPrefectureCompleted ? "steps" : "welcome"
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    prefecture: initialPrefectureCompleted,
    concern_topics: false,
    notification: false,
  });
  const [skippedSteps, setSkippedSteps] = useState<SkippedSteps>({});

  const totalSteps = STEP_DEFINITIONS.length;

  const completedCount = Object.values(stepCompletion).filter(Boolean).length;
  const progress = (completedCount / totalSteps) * 100;

  const currentStep = STEP_DEFINITIONS[currentStepIndex];

  useEffect(() => {
    const allCompleted =
      stepCompletion.prefecture &&
      stepCompletion.concern_topics &&
      stepCompletion.notification &&
      currentStepIndex === totalSteps - 1;
    if (allCompleted && phase === "steps") {
      setPhase("complete");
    }
  }, [stepCompletion, currentStepIndex, totalSteps, phase]);

  const handleStartOnboarding = useCallback(() => {
    setPhase("steps");
  }, []);

  const handleStepComplete = useCallback(
    (key: StepKey) => {
      setStepCompletion((prev) => ({
        ...prev,
        [key]: true,
      }));

      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        return prev;
      });
    },
    [totalSteps]
  );

  const handleStepSkip = useCallback(
    (key: StepKey) => {
      setStepCompletion((prev) => ({
        ...prev,
        [key]: true,
      }));
      setSkippedSteps((prev) => ({
        ...prev,
        [key]: true,
      }));

      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        return prev;
      });
    },
    [totalSteps]
  );

  const handleGoBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleGoToStep = useCallback(
    (index: number) => {
      const step = STEP_DEFINITIONS[index];
      if (step && stepCompletion[step.key]) {
        setCurrentStepIndex(index);
      }
    },
    [stepCompletion]
  );

  const handleGoToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return {
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
  };
}
