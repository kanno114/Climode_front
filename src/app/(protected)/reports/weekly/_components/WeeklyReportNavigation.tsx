"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface WeeklyReportNavigationProps {
  currentWeekStart: string;
}

const MONTH_LABELS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

/**
 * 指定日を含む週の月曜日を返す
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function WeeklyReportNavigation({
  currentWeekStart,
}: WeeklyReportNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = new Date(currentWeekStart);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeekStart = new Date(current);
  nextWeekStart.setDate(current.getDate() + 7);
  const isNextDisabled = nextWeekStart > today;

  const [pickerYear, setPickerYear] = useState(current.getFullYear());
  const [open, setOpen] = useState(false);

  const currentYear = current.getFullYear();
  const currentMonthIndex = current.getMonth();

  const navigate = (weekStart: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "report");
    params.set("start", weekStart);
    router.push(`/reports/weekly?${params.toString()}`);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(current);
    newDate.setDate(current.getDate() + (direction === "next" ? 7 : -7));
    navigate(newDate.toISOString().split("T")[0]);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const firstOfMonth = new Date(pickerYear, monthIndex, 1);
    const monday = getMonday(firstOfMonth);
    if (monday.getMonth() !== firstOfMonth.getMonth()) {
      monday.setDate(monday.getDate() + 7);
    }
    navigate(monday.toISOString().split("T")[0]);
    setOpen(false);
  };

  const isFutureMonth = (monthIndex: number) => {
    return (
      pickerYear > today.getFullYear() ||
      (pickerYear === today.getFullYear() && monthIndex > today.getMonth())
    );
  };

  const isSelected = (monthIndex: number) => {
    return pickerYear === currentYear && monthIndex === currentMonthIndex;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {currentYear}年{currentMonthIndex + 1}月
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-3" align="start">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPickerYear((y) => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{pickerYear}年</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPickerYear((y) => y + 1)}
              disabled={pickerYear >= today.getFullYear()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {MONTH_LABELS.map((label, i) => (
              <Button
                key={i}
                variant={isSelected(i) ? "default" : "ghost"}
                size="sm"
                className="h-9 text-xs"
                disabled={isFutureMonth(i)}
                onClick={() => handleMonthSelect(i)}
              >
                {label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-1">
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
          disabled={isNextDisabled}
        >
          次週
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
