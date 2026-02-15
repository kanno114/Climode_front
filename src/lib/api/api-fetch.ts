import {
  getAccessTokenFromCookies,
  clearAuthCookies,
} from "@/lib/auth/cookies";

/**
 * 認証付きAPIリクエストを送信する
 *
 * - JWTトークンをAuthorizationヘッダに自動付与する
 * - 401レスポンス時は認証クッキーを自動クリアする
 */
export async function apiFetch(input: string, init: RequestInit = {}) {
  const { headers, ...rest } = init;
  const accessToken = await getAccessTokenFromCookies();
  const mergedHeaders: HeadersInit = { ...(headers || {}) };

  if (accessToken) {
    (mergedHeaders as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  const response = await fetch(input, { ...rest, headers: mergedHeaders });

  if (response.status === 401) {
    await clearAuthCookies();
  }

  return response;
}
