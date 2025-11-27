"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { STEP_DEFINITIONS, type StepKey } from "../onboarding-steps.config";

type StepCompletion = Record<StepKey, boolean>;

type UseOnboardingWizardOptions = {
  initialPrefectureCompleted: boolean;
  initialTriggerCompleted: boolean;
};

export function useOnboardingWizard({
  initialPrefectureCompleted,
  initialTriggerCompleted,
}: UseOnboardingWizardOptions) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    prefecture: initialPrefectureCompleted,
    trigger: initialTriggerCompleted,
    notification: false,
  });

  const totalSteps = STEP_DEFINITIONS.length;

  const progress = useMemo(
    () => ((currentStepIndex + 1) / totalSteps) * 100,
    [currentStepIndex, totalSteps]
  );

  const currentStep = STEP_DEFINITIONS[currentStepIndex];

  useEffect(() => {
    if (
      stepCompletion.notification &&
      stepCompletion.prefecture &&
      currentStepIndex === totalSteps - 1
    ) {
      router.push("/dashboard");
    }
  }, [stepCompletion, currentStepIndex, router, totalSteps]);

  const handleStepComplete = useCallback((key: StepKey) => {
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
  }, [totalSteps]);

  const handleStepSkip = useCallback((key: StepKey) => {
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
  }, [totalSteps]);

  const handleGoBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    progress,
    handleStepComplete,
    handleStepSkip,
    handleGoBack,
  };
}


