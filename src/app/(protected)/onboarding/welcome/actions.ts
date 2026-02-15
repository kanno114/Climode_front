"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/api-fetch";
import { parseApiError } from "@/lib/api/parse-error";

type ActionResult =
  | {
      status: "success";
    }
  | {
      status: "error";
      error?: string;
    };

export async function updateOnboardingPrefecture(
  prefectureId: number,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      error: "認証が必要です。再度ログインしてください。",
    };
  }
  if (!prefectureId) {
    return {
      status: "error",
      error: "都道府県を選択してください。",
    };
  }
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
            prefecture_id: prefectureId,
          },
        }),
      },
    );

    if (!res.ok) {
      const errorMessage = await parseApiError(
        res,
        "取得地域の保存に失敗しました",
      );
      return {
        status: "error",
        error: errorMessage,
      };
    }

    revalidatePath("/profile");
    return { status: "success" };
  } catch {
    return {
      status: "error",
      error: "取得地域の保存に失敗しました",
    };
  }
}
