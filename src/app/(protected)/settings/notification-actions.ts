"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/api-fetch";
import { parseApiError } from "@/lib/api/parse-error";
import {
  type ActionResult,
  successVoid,
  failure,
} from "@/lib/api/action-result";

export async function subscribePushNotificationAction(subscription: {
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return failure("認証が必要です", "auth_required");
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/push_subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
      body: JSON.stringify({ subscription }),
    },
  ).catch(() => null);

  if (!res) {
    return failure("通信エラーが発生しました。もう一度お試しください。", "network_error");
  }
  if (res.status === 401) redirect("/signin");

  if (res.ok) {
    return successVoid();
  } else {
    const errorMessage = await parseApiError(
      res,
      "通知の登録に失敗しました",
    );
    return failure(errorMessage);
  }
}

export async function unsubscribePushNotificationAction(
  endpoint: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) {
    return failure("認証が必要です", "auth_required");
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/push_subscriptions/by_endpoint`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
      body: JSON.stringify({ endpoint }),
    },
  ).catch(() => null);

  if (!res) {
    return failure("通信エラーが発生しました。もう一度お試しください。", "network_error");
  }
  if (res.status === 401) redirect("/signin");

  if (res.ok) {
    return successVoid();
  } else {
    const errorMessage = await parseApiError(
      res,
      "通知の解除に失敗しました",
    );
    return failure(errorMessage);
  }
}
