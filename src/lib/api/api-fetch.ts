import { getAccessTokenFromCookies } from "@/lib/auth/cookies";

export async function apiFetch(input: string, init: RequestInit = {}) {
  const { headers, ...rest } = init;
  const accessToken = await getAccessTokenFromCookies();
  const mergedHeaders: HeadersInit = { ...(headers || {}) };

  if (accessToken) {
    (mergedHeaders as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  return fetch(input, { ...rest, headers: mergedHeaders });
}
