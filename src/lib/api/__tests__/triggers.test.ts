import {
  fetchTriggerPresets,
  fetchUserTriggers,
  registerUserTrigger,
  bulkRegisterUserTriggers,
  deleteUserTrigger,
} from "../triggers";
import { apiFetch } from "@/lib/api/api-fetch";

jest.mock("@/lib/api/api-fetch", () => ({
  apiFetch: jest.fn(),
}));

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const BASE_URL = "https://api.example.com";

const sampleTrigger = {
  id: 1,
  key: "pressure_drop",
  label: "気圧低下",
  category: "env" as const,
  is_active: true,
  version: 1,
  rule: {
    metric: "pressure_drop_6h",
    operator: "lte",
    levels: [{ id: "attention", label: "注意", threshold: -3.0, priority: 50 }],
  },
};

const sampleUserTrigger = {
  id: 10,
  created_at: "2025-11-12T00:00:00Z",
  updated_at: "2025-11-12T00:00:00Z",
  trigger: sampleTrigger,
};

function createResponse<T>(
  data: T,
  init: { ok?: boolean; status?: number; statusText?: string } = {}
) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? (init.ok === false ? 500 : 200),
    statusText: init.statusText ?? "OK",
    json: jest.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe("triggers API helpers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.API_BASE_URL_SERVER = BASE_URL;
  });

  describe("fetchTriggerPresets", () => {
    it("APIからトリガー一覧を取得する", async () => {
      mockApiFetch.mockResolvedValueOnce(createResponse([sampleTrigger]));

      const result = await fetchTriggerPresets("user-1");

      expect(mockApiFetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/triggers`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Accept: "application/json",
            "User-Id": "user-1",
          }),
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0].key).toBe("pressure_drop");
    });

    it("APIエラー時に例外を投げる", async () => {
      mockApiFetch.mockResolvedValueOnce(
        createResponse({ error: "Unauthorized" }, { ok: false, status: 401 })
      );

      await expect(fetchTriggerPresets("user-1")).rejects.toThrow(
        "Unauthorized"
      );
    });
  });

  describe("fetchUserTriggers", () => {
    it("ユーザートリガー一覧を取得する", async () => {
      mockApiFetch.mockResolvedValueOnce(createResponse([sampleUserTrigger]));

      const result = await fetchUserTriggers("user-1");
      expect(mockApiFetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/user_triggers`,
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result[0].trigger.key).toBe("pressure_drop");
    });
  });

  describe("registerUserTrigger", () => {
    it("新しいユーザートリガーを登録する", async () => {
      mockApiFetch.mockResolvedValueOnce(createResponse(sampleUserTrigger));

      const result = await registerUserTrigger("user-1", {
        triggerKey: "pressure_drop",
      });

      expect(mockApiFetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/user_triggers`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            user_trigger: {
              trigger_id: undefined,
              trigger_key: "pressure_drop",
            },
          }),
        })
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.userTrigger.trigger.key).toBe("pressure_drop");
      }
    });

    it("重複登録時はエラー情報を返す", async () => {
      mockApiFetch.mockResolvedValueOnce(
        createResponse(
          { error: "Trigger already registered" },
          { ok: false, status: 409 }
        )
      );

      const result = await registerUserTrigger("user-1", {
        triggerKey: "pressure_drop",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe(409);
        expect(result.error).toContain("Trigger already registered");
      }
    });
  });

  describe("bulkRegisterUserTriggers", () => {
    it("複数のトリガー登録結果を分類する", async () => {
      mockApiFetch
        .mockResolvedValueOnce(createResponse(sampleUserTrigger))
        .mockResolvedValueOnce(
          createResponse(
            { error: "Trigger already registered" },
            { ok: false, status: 409 }
          )
        );

      const result = await bulkRegisterUserTriggers("user-1", [
        { triggerKey: "pressure_drop" },
        { triggerKey: "humidity_high" },
      ]);

      expect(result.created).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].status).toBe(409);
    });
  });

  describe("deleteUserTrigger", () => {
    it("ユーザートリガーを削除する", async () => {
      mockApiFetch.mockResolvedValueOnce(
        createResponse({}, { ok: true, status: 204 })
      );

      const result = await deleteUserTrigger("user-1", 10);
      expect(mockApiFetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/user_triggers/10`,
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result).toEqual({ success: true });
    });

    it("削除失敗時にエラー情報を返す", async () => {
      mockApiFetch.mockResolvedValueOnce(
        createResponse({ error: "Not found" }, { ok: false, status: 404 })
      );

      const result = await deleteUserTrigger("user-1", 99);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe(404);
        expect(result.error).toBe("Not found");
      }
    });
  });
});

