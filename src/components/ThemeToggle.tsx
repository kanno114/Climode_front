"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themeOptions = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
  { value: "system", label: "システム", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Select
      value={mounted ? theme : "system"}
      onValueChange={setTheme}
      disabled={!mounted}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="テーマを選択" />
      </SelectTrigger>
      <SelectContent>
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <Icon className="size-4" />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
