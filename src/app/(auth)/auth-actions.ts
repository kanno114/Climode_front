"use server";

import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

export async function setAuthCookiesAction(params: {
  accessToken: string;
  refreshToken: string;
  accessTokenMaxAgeSec?: number;
  refreshTokenMaxAgeSec?: number;
}) {
  await setAuthCookies(params);
}

export async function clearAuthCookiesAction() {
  await clearAuthCookies();
}
