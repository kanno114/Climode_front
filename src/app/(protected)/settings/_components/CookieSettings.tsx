"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCookieConsent, setCookieConsent } from "@/lib/cookie-consent";
import type { CookieConsentValue } from "@/lib/cookie-consent";

export function CookieSettings() {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(getCookieConsent());
    setMounted(true);
  }, []);

  const handleChange = (value: CookieConsentValue) => {
    setCookieConsent(value);
    setConsent(value);
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-3">
      <div>
        <Label className="flex items-center gap-2">
          <Cookie className="h-4 w-4" />
          Cookie設定
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          アクセス解析（Google Analytics）のCookie使用について設定できます
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {consent === "accepted"
              ? "Cookieを許可中"
              : consent === "rejected"
                ? "Cookieを拒否中"
                : "未設定"}
          </p>
          <p className="text-sm text-muted-foreground">
            {consent === "accepted"
              ? "サービス改善のためのアクセス解析データが送信されます"
              : "アクセス解析用のCookieは使用されていません"}
          </p>
        </div>
        {consent === "accepted" ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChange("rejected")}
          >
            拒否する
          </Button>
        ) : (
          <Button size="sm" onClick={() => handleChange("accepted")}>
            許可する
          </Button>
        )}
      </div>
    </div>
  );
}
