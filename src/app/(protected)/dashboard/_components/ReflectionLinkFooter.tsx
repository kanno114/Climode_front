"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { getTimeOfDay } from "@/lib/time-based";

interface ReflectionLinkFooterProps {
  hasReflection: boolean;
}

export function ReflectionLinkFooter({
  hasReflection,
}: ReflectionLinkFooterProps) {
  const [mounted, setMounted] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<
    "morning" | "afternoon" | "evening" | "night" | null
  >(null);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());

    const interval = setInterval(
      () => {
        setTimeOfDay(getTimeOfDay());
      },
      60 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  const isMorningOrAfternoon =
    timeOfDay === "morning" || timeOfDay === "afternoon";
  const showLink =
    mounted && !hasReflection && timeOfDay && isMorningOrAfternoon;

  if (!showLink) return null;

  return (
    <div className="flex justify-end pt-2">
      <Link
        href="/evening"
        className="flex items-center gap-2 text-base text-slate-700 dark:text-slate-300 font-medium underline underline-offset-4 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <NotebookPen className="h-4 w-4" />
        1日を振り返る
      </Link>
    </div>
  );
}
