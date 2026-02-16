/**
 * Server Actions の統一戻り値型
 *
 * フォーム送信以外（プッシュ通知の登録/解除、関心トピック更新等）で使用する。
 * Conform を使ったフォームアクションは SubmissionResult を使う。
 */
export type ActionResult<T = void> =
  | { status: "success"; data: T }
  | { status: "error"; error: { message: string; code?: string } };

export function success<T>(data: T): ActionResult<T> {
  return { status: "success", data };
}

export function successVoid(): ActionResult<void> {
  return { status: "success", data: undefined };
}

export function failure(
  message: string,
  code?: string,
): ActionResult<never> {
  return { status: "error", error: { message, code } };
}
