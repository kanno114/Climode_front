"use server";

import { auth } from "@/auth";
import {
  bulkRegisterUserTriggers,
  deleteUserTrigger,
  fetchUserTriggers,
  type RegisterUserTriggerResult,
} from "@/lib/api/triggers";
import { revalidatePath } from "next/cache";

type RemoveUserTriggerState =
  | {
      status: "idle";
    }
  | {
      status: "success";
    }
  | {
      status: "error";
      error: string;
    };

export async function removeUserTriggerAction(
  _prevState: RemoveUserTriggerState | undefined,
  formData: FormData
): Promise<RemoveUserTriggerState> {
  const session = await auth();

  if (!session?.user) {
    return {
      status: "error",
      error: "認証が必要です。再度ログインしてください。",
    };
  }

  const userTriggerIdRaw = formData.get("userTriggerId");
  const userTriggerId = Number(userTriggerIdRaw);

  if (!userTriggerId || Number.isNaN(userTriggerId)) {
    return {
      status: "error",
      error: "削除対象が選択されていません。",
    };
  }

  const result = await deleteUserTrigger(session.user.id, userTriggerId);

  if (!result.success) {
    return {
      status: "error",
      error: result.error || "トリガーの削除に失敗しました。",
    };
  }

  revalidatePath("/settings/triggers");
  revalidatePath("/dashboard");

  return {
    status: "success",
  };
}

type TriggerSetupState =
  | {
      status: "error";
      errors: string[];
    }
  | {
      status: "idle";
    };

function isConflict(result: RegisterUserTriggerResult) {
  return !result.success && result.status === 409;
}

export async function registerTriggerSelection(
  _prevState: TriggerSetupState | undefined,
  formData: FormData
): Promise<TriggerSetupState> {
  const session = await auth();

  if (!session?.user) {
    return {
      status: "error",
      errors: ["認証が必要です。再度ログインしてください。"],
    };
  }

  // 現在の登録状況を取得
  const current = await fetchUserTriggers(session.user.id);
  const currentKeys = new Set(current.map((u) => u.trigger.key));
  const currentMap = new Map(current.map((u) => [u.trigger.key, u.id])); // key -> user_trigger_id

  // 送信された選択を取得
  const submittedKeys = new Set(
    formData
      .getAll("triggerKeys")
      .map((v) => String(v).trim())
      .filter(Boolean)
  );

  // 差分計算
  const toAdd: string[] = [];
  const toRemoveIds: number[] = [];
  for (const k of submittedKeys) {
    if (!currentKeys.has(k)) toAdd.push(k);
  }
  for (const k of currentKeys) {
    if (!submittedKeys.has(k)) {
      const id = currentMap.get(k);
      if (id) toRemoveIds.push(id);
    }
  }

  // 追加（409は重複としてスキップ）
  if (toAdd.length > 0) {
    const { errors } = await bulkRegisterUserTriggers(
      session.user.id,
      toAdd.map((k) => ({ triggerKey: k }))
    );
    const blocking = errors.filter((e) => !isConflict(e));
    if (blocking.length > 0) {
      return { status: "error", errors: blocking.map((e) => e.error) };
    }
  }

  // 削除
  for (const id of toRemoveIds) {
    const res = await deleteUserTrigger(session.user.id, id);
    if (!res.success) {
      return {
        status: "error",
        errors: [res.error || "トリガーの削除に失敗しました。"],
      };
    }
  }

  // 表示の最新化
  revalidatePath("/settings/triggers");
  revalidatePath("/dashboard");
  return { status: "idle" };
}
