"use server";

import { parseWithZod } from "@conform-to/zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/api-fetch";
import { profileSchema } from "@/lib/schemas/profile";
import { parseApiError } from "@/lib/api/parse-error";

export async function getPrefectures() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/prefectures`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Id": session.user.id,
        },
      }
    );

    if (res.ok) {
      return await res.json();
    } else {
      console.error("都道府県データ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("都道府県データ取得エラー:", error);
    return null;
  }
}

export async function getProfileAction() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/users/${session.user.id}`,
      {
        method: "GET",
      }
    );

    if (res.ok) {
      return await res.json();
    } else {
      console.error("プロファイル取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("プロファイル取得エラー:", error);
    return null;
  }
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

  try {
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
      }
    );

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
  } catch (error) {
    console.error("プロファイル更新エラー:", error);
    return submission.reply({
      formErrors: ["プロファイルの更新に失敗しました"],
    });
  }
}

export async function subscribePushNotificationAction(subscription: {
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}) {
  const session = await auth();
  if (!session?.user) {
    return {
      status: "error" as const,
      error: { message: "認証が必要です" },
    };
  }

  try {
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
      }
    );

    if (res.ok) {
      return { status: "success" as const };
    } else {
      const errorMessage = await parseApiError(
        res,
        "通知の登録に失敗しました",
      );
      return {
        status: "error" as const,
        error: { message: errorMessage },
      };
    }
  } catch (error) {
    console.error("通知登録エラー:", error);
    return {
      status: "error" as const,
      error: { message: "通知の登録に失敗しました" },
    };
  }
}

export async function unsubscribePushNotificationAction(endpoint: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      status: "error" as const,
      error: { message: "認証が必要です" },
    };
  }

  try {
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
      }
    );

    if (res.ok) {
      return { status: "success" as const };
    } else {
      const errorMessage = await parseApiError(
        res,
        "通知の解除に失敗しました",
      );
      return {
        status: "error" as const,
        error: { message: errorMessage },
      };
    }
  } catch (error) {
    console.error("通知解除エラー:", error);
    return {
      status: "error" as const,
      error: { message: "通知の解除に失敗しました" },
    };
  }
}
