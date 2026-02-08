"use client";

import { useEffect, useState } from "react";

/**
 * メディアクエリのマッチ結果を返すフック
 * SSR/初回レンダー時は defaultValue を返し、クライアントで matchMedia の結果に更新する
 * (hydration mismatch を避けるため)
 */
export function useMediaQuery(query: string, defaultValue = true): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
