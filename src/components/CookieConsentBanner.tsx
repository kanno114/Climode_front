"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { hasRespondedToConsent, setCookieConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasRespondedToConsent()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setCookieConsent("accepted");
    setVisible(false);
    window.location.reload();
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm p-4 shadow-lg">
      <div className="mx-auto max-w-3xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          このサイトでは、サービス改善のためにCookieを使用しています。詳しくは
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            プライバシーポリシー
          </Link>
          をご覧ください。
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleReject}>
            拒否する
          </Button>
          <Button size="sm" onClick={handleAccept}>
            同意する
          </Button>
        </div>
      </div>
    </div>
  );
}
