import { getAccessTokenFromCookies } from "@/lib/auth/cookies";
import { refreshAccessToken } from "@/lib/auth/token-validator";

type ApiFetchOptions = RequestInit & { retryOnUnauthorized?: boolean };

export async function apiFetch(input: string, init: ApiFetchOptions = {}) {
  const { retryOnUnauthorized = true, headers, ...rest } = init;
  const accessToken = await getAccessTokenFromCookies();
  const mergedHeaders: HeadersInit = { ...(headers || {}) };

  if (accessToken) {
    (mergedHeaders as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  let res = await fetch(input, { ...rest, headers: mergedHeaders });

  if (res.status === 401 && retryOnUnauthorized) {
    // トークンリフレッシュを試行
    const refreshResult = await refreshAccessToken();

    if (refreshResult.success && refreshResult.newAccessToken) {
      // 新しいトークンでリクエストを再実行
      (mergedHeaders as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${refreshResult.newAccessToken}`;

      res = await fetch(input, {
        ...rest,
        headers: mergedHeaders,
      });
    } else {
      // リフレッシュに失敗した場合、401のまま返す
      // 呼び出し元で未ログインUIへ分岐する
    }
  }

  return res;
}
