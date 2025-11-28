"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface WeeklyReportNavigationProps {
  currentWeekStart: string;
}

export function WeeklyReportNavigation({
  currentWeekStart,
}: WeeklyReportNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateWeek = (direction: "prev" | "next") => {
    const current = new Date(currentWeekStart);
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + (direction === "next" ? 7 : -7));
    const newWeekStart = newDate.toISOString().split("T")[0];

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "report");
    params.set("start", newWeekStart);
    router.push(`/reports/weekly?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateWeek("prev")}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        前週
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateWeek("next")}
        className="flex items-center gap-1"
      >
        次週
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
