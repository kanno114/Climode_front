"use server";

import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { apiFetch } from "@/lib/api/api-fetch";

export async function setAuthCookiesAction(params: {
  accessToken: string;
  accessTokenMaxAgeSec?: number;
}) {
  await setAuthCookies(params);
}

export async function clearAuthCookiesAction() {
  await clearAuthCookies();
}

export async function resendConfirmationEmail(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const res = await apiFetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/email_confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      return { success: true };
    }

    return { success: false, error: data.message || "送信に失敗しました" };
  } catch {
    return { success: false, error: "通信エラーが発生しました" };
  }
}
