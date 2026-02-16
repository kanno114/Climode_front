import { apiFetch } from "@/lib/api/api-fetch";
import {
  ConcernTopicListSchema,
  type ConcernTopic,
} from "@/lib/schemas/concern-topics";

export class AuthenticationError extends Error {
  constructor() {
    super("セッションが無効です。再度ログインしてください。");
    this.name = "AuthenticationError";
  }
}

function getApiBaseUrl() {
  const baseUrl = process.env.API_BASE_URL_SERVER;
  if (!baseUrl) {
    throw new Error("API_BASE_URL_SERVER is not configured");
  }
  return baseUrl;
}

function buildUrl(path: string) {
  return `${getApiBaseUrl()}${path}`;
}

function buildHeaders(userId?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (userId) {
    headers["User-Id"] = userId;
  }
  return headers;
}

function checkAuthError(res: Response): void {
  if (res.status === 401) {
    throw new AuthenticationError();
  }
}

export async function fetchConcernTopics(
  userId: string,
): Promise<ConcernTopic[]> {
  const res = await apiFetch(buildUrl("/api/v1/concern_topics"), {
    method: "GET",
    headers: buildHeaders(userId),
  });

  checkAuthError(res);

  if (!res.ok) {
    throw new Error(`関心トピックの取得に失敗しました: ${res.statusText}`);
  }

  const json = await res.json();
  return ConcernTopicListSchema.parse(json);
}

export async function fetchUserConcernTopics(
  userId: string,
): Promise<string[]> {
  const res = await apiFetch(buildUrl("/api/v1/user_concern_topics"), {
    method: "GET",
    headers: buildHeaders(userId),
  });

  checkAuthError(res);

  if (!res.ok) {
    throw new Error(`ユーザーの関心トピック取得に失敗しました: ${res.statusText}`);
  }

  const json = await res.json();
  const keys = Array.isArray(json.keys) ? json.keys : [];
  return keys.map((k: unknown) => String(k));
}

export async function updateUserConcernTopics(
  userId: string,
  keys: string[],
): Promise<void> {
  const res = await apiFetch(buildUrl("/api/v1/user_concern_topics"), {
    method: "PUT",
    headers: {
      ...buildHeaders(userId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keys }),
  });

  checkAuthError(res);

  if (!res.ok) {
    throw new Error(`関心トピックの更新に失敗しました: ${res.statusText}`);
  }
}
