"use client";

import type { ReactNode } from "react";
import { TimeBasedHeader } from "./TimeBasedHeader";

interface GreetingSectionProps {
  hasDailyLog: boolean;
  hasReflection: boolean;
  reflectionSlot?: ReactNode;
}

export function GreetingSection({
  hasDailyLog,
  hasReflection,
  reflectionSlot,
}: GreetingSectionProps) {
  return (
    <TimeBasedHeader
      hasDailyLog={hasDailyLog}
      hasReflection={hasReflection}
      reflectionSlot={reflectionSlot}
    />
  );
}
