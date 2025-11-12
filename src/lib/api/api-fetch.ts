import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth/cookies";
import {
  refreshAccessToken,
  type TokenRefreshResult,
} from "@/lib/auth/token-validator";

type ApiFetchOptions = RequestInit & { retryOnUnauthorized?: boolean };

// リフレッシュ処理中のPromiseを保持（ロック機構）
let refreshPromise: Promise<TokenRefreshResult | null> | null = null;

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
    // 既にリフレッシュ中の場合は、そのPromiseを待つ
    if (refreshPromise) {
      const refreshResult = await refreshPromise;
      if (refreshResult?.success && refreshResult.newAccessToken) {
        // 新しいトークンでリクエストを再実行
        (mergedHeaders as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${refreshResult.newAccessToken}`;
        res = await fetch(input, { ...rest, headers: mergedHeaders });
      }
    } else {
      // リフレッシュ処理を開始
      refreshPromise = (async () => {
        try {
          const refreshResult = await refreshAccessToken();

          if (refreshResult.success && refreshResult.newAccessToken) {
            // CookieをRoute Handler経由で更新（アクセストークンは新、リフレッシュは既存を維持）
            try {
              const currentRefreshToken = await getRefreshTokenFromCookies();
              // サーバーサイドでは絶対URLが必要
              const baseUrl =
                process.env.NEXTAUTH_URL ||
                process.env.NEXT_PUBLIC_APP_URL ||
                "http://localhost:3000";
              await fetch(`${baseUrl}/api/auth/update-tokens`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  accessToken: refreshResult.newAccessToken,
                  refreshToken:
                    refreshResult.newRefreshToken || currentRefreshToken || "",
                }),
              });
            } catch (e) {
              console.error("Failed to update cookies via Route Handler:", e);
            }
          }

          return refreshResult;
        } catch (e) {
          console.error("Failed to refresh token:", e);
          return null;
        } finally {
          // リフレッシュ完了後、Promiseをクリア
          refreshPromise = null;
        }
      })();

      const refreshResult = await refreshPromise;

      if (refreshResult?.success && refreshResult.newAccessToken) {
        // 新しいトークンでリクエストを再実行
        (mergedHeaders as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${refreshResult.newAccessToken}`;
        res = await fetch(input, { ...rest, headers: mergedHeaders });
      }
    }
  }

  return res;
}
