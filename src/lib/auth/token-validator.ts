import { getAccessTokenFromCookies } from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

export type TokenValidationResult = {
  isValid: boolean;
  accessToken: string | null;
};

// --- 純粋関数 ---

export function parseTokenValidationResponse(
  data: Record<string, unknown>,
  accessToken: string,
): TokenValidationResult {
  if (data.valid) {
    return { isValid: true, accessToken };
  }
  return { isValid: false, accessToken };
}

// --- 副作用関数 ---

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
    };
  }

  // アクセストークンが存在する場合は有効とみなす
  // 実際の有効性はAPIリクエスト時に401エラーで判定
  return {
    isValid: true,
    accessToken,
  };
}

/**
 * 認証に失敗した場合の処理（redirect でログアウトページへ）
 */
export async function handleAuthFailure(): Promise<void> {
  // Cookie を触らず、ログアウトページにリダイレクト
  redirect("/auth/logout?reason=session_expired");
}

/**
 * Rails APIでトークンの有効性を確認する
 * @returns TokenValidationResult
 */
export async function validateTokenWithApi(): Promise<TokenValidationResult> {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return {
      isValid: false,
      accessToken: null,
    };
  }

  try {
    const validateEndpoint = `${process.env.API_BASE_URL_SERVER}/api/v1/validate_token`;
    const response = await fetch(validateEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return parseTokenValidationResponse(data, accessToken);
    }

    return {
      isValid: false,
      accessToken,
    };
  } catch {
    return {
      isValid: false,
      accessToken,
    };
  }
}

/**
 * トークンの有効性を確認し、無効ならログアウトへリダイレクトする
 * @returns 有効なアクセストークンまたはnull
 */
export async function ensureValidToken(): Promise<string | null> {
  const validation = await validateAccessToken();

  if (validation.isValid && validation.accessToken) {
    return validation.accessToken;
  }

  // アクセストークンが無効な場合、認証失敗処理
  await handleAuthFailure();
  return null;
}
