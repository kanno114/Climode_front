"use client";

import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePushNotification } from "@/hooks/use-push-notification";

export function NotificationSettings() {
  const { isSubscribed, isLoading, isSupported, subscribe, unsubscribe } =
    usePushNotification();

  const handleSubscribe = async () => {
    try {
      await subscribe();
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
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
      toast.success("通知を無効にしました");
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error("通知の解除に失敗しました");
    }
  };

  if (!isSupported) {
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
        {isLoading && !isSubscribed ? (
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isSubscribed ? "通知オン" : "通知オフ"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSubscribed
                    ? "朝8時に今日の行動提案、夜20時に振り返りのリマインドが届きます"
                    : "通知を有効にすると朝8時と夜20時にリマインダーが届きます"}
                </p>
              </div>
              <Button
                onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                disabled={isLoading}
                variant={isSubscribed ? "outline" : "default"}
              >
                {isLoading ? (
                  "処理中..."
                ) : isSubscribed ? (
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

            {!isSubscribed && (
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
