"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  fetchConcernTopics,
  fetchUserConcernTopics,
  updateUserConcernTopics,
} from "@/lib/api/concern-topics";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";
import {
  type ActionResult,
  successVoid,
  failure,
} from "@/lib/api/action-result";
import { AuthenticationError } from "@/lib/api/concern-topics";

export async function getConcernTopicsAction(): Promise<ConcernTopic[] | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    return await fetchConcernTopics(session.user.id);
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/signin");
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
    if (error instanceof AuthenticationError) redirect("/signin");
    return null;
  }
}

export async function updateUserConcernTopicsAction(
  keys: string[],
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return failure("認証が必要です", "auth_required");
  }

  try {
    await updateUserConcernTopics(session.user.id, keys);
    revalidatePath("/concern-topics");
    return successVoid();
  } catch (error) {
    if (error instanceof AuthenticationError) redirect("/signin");
    return failure(
      error instanceof Error ? error.message : "関心ワードの更新に失敗しました",
    );
  }
}
