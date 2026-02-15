"use client";

import { CloudSun } from "lucide-react";
import { ForecastTableAutoScroll } from "./ForecastTable";
import type { ForecastPoint } from "../actions";

interface WeatherSectionProps {
  forecast: ForecastPoint[] | null;
}

export function WeatherSection({ forecast }: WeatherSectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white px-1">
        <CloudSun className="h-5 w-5 text-amber-500" />
        24時間予報
      </h2>
      <ForecastTableAutoScroll forecast={forecast} />
    </section>
  );
}
