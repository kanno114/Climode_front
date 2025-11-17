import { apiFetch } from "@/lib/api/api-fetch";
import {
  TriggerListSchema,
  UserTriggerListSchema,
  UserTriggerSchema,
  type Trigger,
  type UserTrigger,
} from "@/lib/schemas/triggers";

type MutationError = {
  success: false;
  status: number;
  error: string;
};

type RegisterUserTriggerSuccess = {
  success: true;
  userTrigger: UserTrigger;
};

export type RegisterUserTriggerResult =
  | RegisterUserTriggerSuccess
  | MutationError;

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

async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return (
      data.error || data.message || data.errors?.join?.(", ") || res.statusText
    );
  } catch {
    return res.statusText || "Unexpected API error";
  }
}

export async function fetchTriggerPresets(userId: string): Promise<Trigger[]> {
  const res = await apiFetch(buildUrl("/api/v1/triggers"), {
    method: "GET",
    headers: buildHeaders(userId),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const json = await res.json();
  return TriggerListSchema.parse(json);
}

export async function fetchUserTriggers(
  userId: string
): Promise<UserTrigger[]> {
  const res = await apiFetch(buildUrl("/api/v1/user_triggers"), {
    method: "GET",
    headers: buildHeaders(userId),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const json = await res.json();
  return UserTriggerListSchema.parse(json);
}

export async function registerUserTrigger(
  userId: string,
  payload: { triggerId?: number; triggerKey?: string }
): Promise<RegisterUserTriggerResult> {
  const body = {
    user_trigger: {
      trigger_id: payload.triggerId,
      trigger_key: payload.triggerKey,
    },
  };

  const res = await apiFetch(buildUrl("/api/v1/user_triggers"), {
    method: "POST",
    headers: {
      ...buildHeaders(userId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const json = await res.json();
    return {
      success: true,
      userTrigger: UserTriggerSchema.parse(json),
    };
  }

  return {
    success: false,
    status: res.status,
    error: await parseErrorResponse(res),
  };
}

export async function bulkRegisterUserTriggers(
  userId: string,
  payload: Array<{ triggerId?: number; triggerKey?: string }>
): Promise<{
  created: UserTrigger[];
  errors: MutationError[];
}> {
  const results = await Promise.all(
    payload.map((item) => registerUserTrigger(userId, item))
  );

  const created: UserTrigger[] = [];
  const errors: MutationError[] = [];

  results.forEach((result) => {
    if (result.success) {
      created.push(result.userTrigger);
    } else {
      errors.push(result);
    }
  });

  return { created, errors };
}

export async function deleteUserTrigger(
  userId: string,
  userTriggerId: number
): Promise<MutationError | { success: true }> {
  const res = await apiFetch(
    buildUrl(`/api/v1/user_triggers/${userTriggerId}`),
    {
      method: "DELETE",
      headers: buildHeaders(userId),
    }
  );

  if (res.ok) {
    return { success: true };
  }

  return {
    success: false,
    status: res.status,
    error: await parseErrorResponse(res),
  };
}
