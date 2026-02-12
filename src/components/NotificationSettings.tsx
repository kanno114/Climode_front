"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  requestNotificationPermission,
  registerServiceWorker,
  isSubscribed,
  isNotificationSupported,
  urlBase64ToUint8Array,
} from "@/lib/push-notification";
import {
  subscribePushNotificationAction,
  unsubscribePushNotificationAction,
} from "@/app/(protected)/profile/actions";

// VAPID public key
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

export function NotificationSettings() {
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    // Check if notifications are supported
    setSupported(isNotificationSupported());

    // Check current subscription status
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const status = await isSubscribed();
      setSubscribed(status);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Request notification permission
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Register service worker
      const registration = await registerServiceWorker();

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe to push notifications
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
        });
      }

      // Send subscription to backend via Server Action
      const subscriptionJSON = subscription.toJSON();
      const result = await subscribePushNotificationAction({
        endpoint: subscriptionJSON.endpoint!,
        p256dh_key: subscriptionJSON.keys!.p256dh,
        auth_key: subscriptionJSON.keys!.auth,
      });

      if (result.status === "error") {
        throw new Error(result.error.message);
      }

      setSubscribed(true);
      toast.success("通知を有効にしました", {
        description:
          "朝8時は行動提案、夜20時は振り返りのリマインドが届きます",
      });
    } catch (error) {
      console.error("Subscribe error:", error);

      if (error instanceof Error) {
        if (error.message.includes("permission denied")) {
          toast.error("通知の許可が必要です", {
            description: "ブラウザの設定で通知を許可してください",
          });
        } else if (error.message.includes("not supported")) {
          toast.error("お使いのブラウザは通知に対応していません");
        } else {
          toast.error("通知の設定に失敗しました", {
            description: error.message,
          });
        }
      } else {
        toast.error("通知の設定に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service workers are not supported");
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log("No subscription found");
        setSubscribed(false);
        return;
      }

      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Delete subscription from backend via Server Action
      const result = await unsubscribePushNotificationAction(
        subscription.endpoint,
      );

      if (result.status === "error") {
        throw new Error(result.error.message);
      }

      setSubscribed(false);
      toast.success("通知を無効にしました");
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error("通知の解除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            プッシュ通知
          </CardTitle>
          <CardDescription>
            お使いのブラウザはプッシュ通知に対応していません
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          プッシュ通知
        </CardTitle>
        <CardDescription>
          朝8時は行動提案、夜20時は振り返りのリマインドを受け取る
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {subscribed ? "通知オン" : "通知オフ"}
            </p>
            <p className="text-sm text-muted-foreground">
              {subscribed
                ? "朝8時に今日の行動提案、夜20時に振り返りのリマインドが届きます"
                : "通知を有効にすると朝8時と夜20時にリマインダーが届きます"}
            </p>
          </div>
          <Button
            onClick={subscribed ? handleUnsubscribe : handleSubscribe}
            disabled={loading}
            variant={subscribed ? "outline" : "default"}
          >
            {loading ? (
              "処理中..."
            ) : subscribed ? (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                無効にする
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                有効にする
              </>
            )}
          </Button>
        </div>

        {!subscribed && (
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium mb-2">通知を有効にすると：</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>朝8時：今日の行動提案</li>
              <li>夜20時：1分で終わる振り返りフォームへのご案内</li>
              <li>記録忘れを防ぐことができます</li>
              <li>継続的な健康管理をサポートします</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
