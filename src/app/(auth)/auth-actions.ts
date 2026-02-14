"use server";

import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

export async function setAuthCookiesAction(params: {
  accessToken: string;
  accessTokenMaxAgeSec?: number;
}) {
  await setAuthCookies(params);
}

export async function clearAuthCookiesAction() {
  await clearAuthCookies();
}
