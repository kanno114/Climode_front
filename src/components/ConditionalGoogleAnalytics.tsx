"use client";

import { useState, useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getCookieConsent } from "@/lib/cookie-consent";

export function ConditionalGoogleAnalytics({ gaId }: { gaId: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getCookieConsent() === "accepted");
  }, []);

  if (!consented) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
