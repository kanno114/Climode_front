"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cookie className="h-5 w-5" />
          Cookie設定
        </CardTitle>
        <CardDescription>
          アクセス解析（Google Analytics）のCookie使用について設定できます
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
