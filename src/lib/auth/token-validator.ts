import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

export type TokenValidationResult = {
  isValid: boolean;
  accessToken: string | null;
  needsRefresh: boolean;
};

export type TokenRefreshResult = {
  success: boolean;
  newAccessToken: string | null;
  newRefreshToken?: string | null; // この行を追加
  error?: string;
};

/**
 * アクセストークンの有効性を確認する
 * @returns TokenValidationResult
 */
export async function validateAccessToken(): Promise<TokenValidationResult> {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return {
      isValid: false,
      accessToken: null,
      needsRefresh: false,
    };
  }

  // アクセストークンが存在する場合は有効とみなす
  // 実際の有効性はAPIリクエスト時に401エラーで判定
  return {
    isValid: true,
    accessToken,
    needsRefresh: false,
  };
}

/**
 * リフレッシュトークンを使用してアクセストークンを更新する
 * @returns TokenRefreshResult
 */
export async function refreshAccessToken(): Promise<TokenRefreshResult> {
  const refreshToken = await getRefreshTokenFromCookies();

  if (!refreshToken) {
    return {
      success: false,
      newAccessToken: null,
      error: "No refresh token available",
    };
  }

  try {
    const refreshEndpoint = `${process.env.API_BASE_URL_SERVER}/api/v1/refresh`;
    const refreshRes = await fetch(refreshEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!refreshRes.ok) {
      console.warn("Token refresh failed:", {
        status: refreshRes.status,
        statusText: refreshRes.statusText,
      });

      return {
        success: false,
        newAccessToken: null,
        error: `Refresh failed: ${refreshRes.status} ${refreshRes.statusText}`,
      };
    }

    const data = await refreshRes.json();
    const { access_token, refresh_token: new_refresh_token } = data || {};

    if (!access_token) {
      return {
        success: false,
        newAccessToken: null,
        error: "Missing access_token in refresh response",
      };
    }

    // Cookieの更新は呼び出し元で行う
    return {
      success: true,
      newAccessToken: access_token,
      newRefreshToken: new_refresh_token || refreshToken,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return {
      success: false,
      newAccessToken: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 認証に失敗した場合の処理（redirect でログアウトページへ）
 */
export async function handleAuthFailure(): Promise<void> {
  console.warn("Authentication failed, redirecting to logout");

  // Cookie を触らず、ログアウトページにリダイレクト
  redirect("/auth/logout?reason=session_expired");
}

/**
 * トークンの有効性を確認し、必要に応じてリフレッシュを試行する
 * @returns 有効なアクセストークンまたはnull
 */
export async function ensureValidToken(): Promise<string | null> {
  const validation = await validateAccessToken();

  if (validation.isValid && validation.accessToken) {
    return validation.accessToken;
  }

  // アクセストークンが無効な場合、リフレッシュを試行
  const refreshResult = await refreshAccessToken();

  if (refreshResult.success && refreshResult.newAccessToken) {
    return refreshResult.newAccessToken;
  }

  // リフレッシュに失敗した場合、認証失敗処理
  await handleAuthFailure();
  return null;
}
