"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/api-fetch";
import { parseApiError } from "@/lib/api/parse-error";
import { type ActionResult, successVoid, failure } from "@/lib/api/action-result";

export async function updateOnboardingPrefecture(
  prefectureId: number,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return failure("認証が必要です。再度ログインしてください。", "auth_required");
  }
  if (!prefectureId) {
    return failure("都道府県を選択してください。", "validation_error");
  }

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
          prefecture_id: prefectureId,
        },
      }),
    },
  ).catch(() => null);

  if (!res) {
    return failure("通信エラーが発生しました。もう一度お試しください。", "network_error");
  }
  if (res.status === 401) redirect("/signin");

  if (!res.ok) {
    const errorMessage = await parseApiError(
      res,
      "取得地域の保存に失敗しました",
    );
    return failure(errorMessage);
  }

  revalidatePath("/profile");
  return successVoid();
}
