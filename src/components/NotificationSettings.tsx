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
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribed,
  isNotificationSupported,
} from "@/lib/push-notification";

interface NotificationSettingsProps {
  token: string;
}

export function NotificationSettings({ token }: NotificationSettingsProps) {
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
      await subscribeToPushNotifications(token);
      setSubscribed(true);
      toast.success("通知を有効にしました", {
        description: "毎日20:00にリマインダーが届きます",
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
      await unsubscribeFromPushNotifications(token);
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
        <CardDescription>毎日の記録リマインダーを受け取る</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {subscribed ? "通知オン" : "通知オフ"}
            </p>
            <p className="text-sm text-muted-foreground">
              {subscribed
                ? "毎日20:00にリマインダーが届きます"
                : "通知を有効にすると毎日リマインダーが届きます"}
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
              <li>毎日20:00にログ記録のリマインダーが届きます</li>
              <li>記録忘れを防ぐことができます</li>
              <li>継続的な健康管理をサポートします</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

