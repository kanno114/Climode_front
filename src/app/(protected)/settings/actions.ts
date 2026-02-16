"use server";

import { parseWithZod } from "@conform-to/zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/api-fetch";
import { profileSchema } from "@/lib/schemas/profile";
import { parseApiError } from "@/lib/api/parse-error";
import { clearAuthCookies } from "@/lib/auth/cookies";

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
    revalidatePath("/settings");
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

export async function deleteAccountAction(params: {
  password?: string;
  confirm?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "認証が必要です" };
  }

  const body: Record<string, unknown> = {};
  if (params.password) {
    body.password = params.password;
  }
  if (params.confirm) {
    body.confirm = true;
  }

  const res = await apiFetch(
    `${process.env.API_BASE_URL_SERVER}/api/v1/users/${session.user.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  ).catch(() => null);

  if (!res) {
    return { success: false, error: "通信エラーが発生しました" };
  }

  if (res.status === 204) {
    await clearAuthCookies();
    redirect("/signin");
  }

  const json = await res.json().catch(() => null);
  return {
    success: false,
    error: json?.message || "アカウントの削除に失敗しました",
  };
}
