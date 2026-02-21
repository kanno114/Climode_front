"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeStepProps = {
  onComplete: (themeName: string) => void;
  onSkip: () => void;
};

const THEME_OPTIONS = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
  { value: "system", label: "システム", icon: Monitor },
] as const;

const THEME_LABEL_MAP: Record<string, string> = {
  light: "ライト",
  dark: "ダーク",
  system: "システム",
};

export function ThemeStep({ onComplete, onSkip }: ThemeStepProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="rounded-lg border p-4 h-24 animate-pulse bg-muted/30"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
      <Button
        className="w-full"
        onClick={() => onComplete(THEME_LABEL_MAP[theme ?? "system"])}
      >
        この設定で続ける
      </Button>
      <Button variant="ghost" className="w-full" onClick={onSkip}>
        スキップ
      </Button>
    </div>
  );
}
