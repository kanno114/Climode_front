/**
 * APIエラーレスポンスのパースユーティリティ
 *
 * バックエンドの統一形式: { error: "code", message: "メッセージ", details?: {} }
 */

export type ApiError = {
  error: string;
  message: string;
  details?: Record<string, string[]>;
};

/**
 * APIエラーレスポンスからユーザー向けメッセージを取得する
 */
export async function parseApiError(
  res: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data = await res.json();
    return data.message || data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

/**
 * APIエラーレスポンスを構造化して取得する
 */
export async function parseApiErrorDetail(
  res: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  try {
    const data = await res.json();
    return {
      error: data.error || "unknown_error",
      message: data.message || fallbackMessage,
      details: data.details,
    };
  } catch {
    return {
      error: "unknown_error",
      message: fallbackMessage,
    };
  }
}
