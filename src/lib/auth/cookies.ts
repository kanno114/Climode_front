import { cookies } from "next/headers";

type SetTokenCookiesParams = {
  accessToken: string;
  accessTokenMaxAgeSec?: number;
};

export async function setAuthCookies({
  accessToken,
  accessTokenMaxAgeSec = 60 * 60 * 24 * 30, // 30日（Rails側と統一）
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
}

export async function getAccessTokenFromCookies(): Promise<string | null> {
  const cs = await cookies();
  return cs.get("access_token")?.value ?? null;
}
