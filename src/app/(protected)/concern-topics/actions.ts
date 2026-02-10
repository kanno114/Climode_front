"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  fetchConcernTopics,
  fetchUserConcernTopics,
  updateUserConcernTopics,
} from "@/lib/api/concern-topics";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";

export async function getConcernTopicsAction(): Promise<ConcernTopic[] | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    return await fetchConcernTopics(session.user.id);
  } catch (error) {
    console.error("関心ワードマスタ取得エラー:", error);
    return null;
  }
}

export async function getUserConcernTopicsAction(): Promise<string[] | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    return await fetchUserConcernTopics(session.user.id);
  } catch (error) {
    console.error("ユーザー関心ワード取得エラー:", error);
    return null;
  }
}

export async function updateUserConcernTopicsAction(keys: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error" as const,
      error: { message: "認証が必要です" },
    };
  }

  try {
    await updateUserConcernTopics(session.user.id, keys);
    revalidatePath("/concern-topics");
    return { status: "success" as const };
  } catch (error) {
    console.error("関心ワード更新エラー:", error);
    return {
      status: "error" as const,
      error: {
        message:
          error instanceof Error ? error.message : "関心ワードの更新に失敗しました",
      },
    };
  }
}
