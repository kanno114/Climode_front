"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  requestNotificationPermission,
  registerServiceWorker,
  isNotificationSupported,
  isSubscribed,
  urlBase64ToUint8Array,
} from "@/lib/push-notification";
import { subscribePushNotificationAction } from "@/app/(protected)/profile/actions";

type NotificationStepProps = {
  onComplete: () => void;
  onSkip: () => void;
};

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export function NotificationStep({
  onComplete,
  onSkip,
}: NotificationStepProps) {
  const [supported, setSupported] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const isSupported = isNotificationSupported();
    setSupported(isSupported);
    if (isSupported) {
      isSubscribed()
        .then((status) => setSubscribed(status))
        .catch(() => setSubscribed(false));
    }
  }, []);

  const handleEnableNotification = async () => {
    if (!supported) {
      setError("お使いのブラウザは通知に対応していません。");
      return;
    }
    if (!VAPID_PUBLIC_KEY) {
      setError("通知の設定に必要な情報が不足しています。");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        setError("通知が許可されませんでした。設定から変更できます。");
        setPending(false);
        return;
      }
      const registration = await registerServiceWorker();
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
        });
      }
      const subscriptionJSON = subscription.toJSON();
      if (!subscriptionJSON?.endpoint || !subscriptionJSON?.keys) {
        setError("通知の登録情報を取得できませんでした。");
        setPending(false);
        return;
      }
      const result = await subscribePushNotificationAction({
        endpoint: subscriptionJSON.endpoint,
        p256dh_key: subscriptionJSON.keys.p256dh!,
        auth_key: subscriptionJSON.keys.auth!,
      });
      if (result.status === "error") {
        setError(result.error.message);
        setPending(false);
        return;
      }
      toast.success("通知を有効にしました");
      setSubscribed(true);
      setPending(false);
      onComplete();
    } catch (err) {
      console.error(err);
      setError("通知の登録に失敗しました。");
      setPending(false);
    }
  };

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex items-center gap-3 rounded-md border border-primary/40 bg-primary/5 px-4 py-3 text-sm">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <p>
          通知は毎日朝8時・夜20時の2回。必要なときは設定からいつでも無効にできます。
        </p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        className="w-full"
        onClick={handleEnableNotification}
        disabled={pending || subscribed || !supported}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            設定中...
          </>
        ) : subscribed ? (
          "通知は有効になっています"
        ) : (
          "通知を有効にする"
        )}
      </Button>
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          toast.info("通知は設定からいつでも有効にできます。");
          onSkip();
        }}
        disabled={pending}
      >
        今はスキップ
      </Button>
    </div>
  );
}
