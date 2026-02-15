"use server";

import { parseWithZod } from "@conform-to/zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/api-fetch";
import { profileSchema } from "@/lib/schemas/profile";
import { parseApiError } from "@/lib/api/parse-error";
import {
  type ActionResult,
  successVoid,
  failure,
} from "@/lib/api/action-result";

export async function getPrefectures() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/prefectures`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
    },
  ).catch(() => null);

  if (!res) return null;
  if (res.status === 401) redirect("/signin");
  if (!res.ok) return null;

  return await res.json();
}

export async function getProfileAction() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/users/${session.user.id}`,
    {
      method: "GET",
    },
  ).catch(() => null);

  if (!res) return null;
  if (res.status === 401) redirect("/signin");
  if (!res.ok) return null;

  return await res.json();
}

export async function updateProfileAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: profileSchema });

  const session = await auth();
  if (!session?.user) {
    return submission.reply({
      formErrors: ["認証が必要です"],
    });
  }

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["入力内容を確認してください"],
    });
  }

  const { name, prefecture_id } = submission.payload;

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/users/${session.user.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Id": session.user.id,
      },
      body: JSON.stringify({
        user: {
          name,
          prefecture_id: parseInt(prefecture_id as string),
        },
      }),
    },
  ).catch(() => null);

  if (!res) {
    return submission.reply({
      formErrors: ["通信エラーが発生しました。もう一度お試しください。"],
    });
  }
  if (res.status === 401) redirect("/signin");

  if (res.ok) {
    revalidatePath("/profile");
    return submission.reply();
  } else {
    const errorMessage = await parseApiError(
      res,
      "プロファイルの更新に失敗しました",
    );
    return submission.reply({
      formErrors: [errorMessage],
    });
  }
}

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
