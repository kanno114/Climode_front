import { cookies } from "next/headers";

type SetTokenCookiesParams = {
  accessToken: string;
  refreshToken: string;
  accessTokenMaxAgeSec?: number;
  refreshTokenMaxAgeSec?: number;
};

export async function setAuthCookies({
  accessToken,
  refreshToken,
  accessTokenMaxAgeSec = 60 * 15, // 15分（Rails側と統一）
  refreshTokenMaxAgeSec = 60 * 60 * 24 * 7, // 7日（Rails側と統一）
}: SetTokenCookiesParams) {
  const cs = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cs.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: accessTokenMaxAgeSec,
  });

  cs.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: refreshTokenMaxAgeSec,
  });
}

export async function clearAuthCookies() {
  const cs = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cs.set("access_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  cs.set("refresh_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAccessTokenFromCookies(): Promise<string | null> {
  const cs = await cookies();
  return cs.get("access_token")?.value ?? null;
}

export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cs = await cookies();
  return cs.get("refresh_token")?.value ?? null;
}
