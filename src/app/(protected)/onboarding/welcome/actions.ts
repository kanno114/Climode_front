"use server";

import { auth } from "@/auth";
import { fetchUserTriggers } from "@/lib/api/triggers";

export async function checkUserTriggersAction(): Promise<{
  hasTriggers: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      hasTriggers: false,
      error: "Not authenticated",
    };
  }

  try {
    const userTriggers = await fetchUserTriggers(session.user.id);
    return {
      hasTriggers: Array.isArray(userTriggers) && userTriggers.length > 0,
    };
  } catch (error) {
    console.error("Failed to check user triggers:", error);
    // 失敗時は初回扱いでページ表示を続ける
    return {
      hasTriggers: false,
    };
  }
}
