import {
  validateTokenWithApi,
  validateAccessToken,
  ensureValidToken,
  handleAuthFailure,
} from "../token-validator";
import { getAccessTokenFromCookies } from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

// モック設定
jest.mock("@/lib/auth/cookies", () => ({
  getAccessTokenFromCookies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetAccessTokenFromCookies =
  getAccessTokenFromCookies as jest.MockedFunction<
    typeof getAccessTokenFromCookies
  >;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

const BASE_URL = "https://api.example.com";

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

describe("token-validator", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.API_BASE_URL_SERVER = BASE_URL;
    global.fetch = jest.fn();
  });

  describe("validateTokenWithApi", () => {
    it("有効なトークンの場合、valid: trueを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse({
          valid: true,
          user_id: 1,
          email: "test@example.com",
        })
      );

      const result = await validateTokenWithApi();

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/validate_token`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        })
      );
      expect(result.isValid).toBe(true);
      expect(result.accessToken).toBe(accessToken);
    });

    it("トークンが存在しない場合、valid: falseを返す", async () => {
      mockGetAccessTokenFromCookies.mockResolvedValue(null);

      const result = await validateTokenWithApi();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBeNull();
    });

    it("期限切れトークンの場合、valid: falseを返す", async () => {
      const accessToken = "expired_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse(
          {
            valid: false,
            error: "認証トークンの有効期限が切れています",
          },
          { ok: false, status: 401 }
        )
      );

      const result = await validateTokenWithApi();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBe(accessToken);
    });

    it("無効なトークンの場合、valid: falseを返す", async () => {
      const accessToken = "invalid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse(
          {
            valid: false,
            error: "無効な認証トークンです",
          },
          { ok: false, status: 401 }
        )
      );

      const result = await validateTokenWithApi();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBe(accessToken);
    });

    it("ネットワークエラーの場合、valid: falseを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await validateTokenWithApi();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBe(accessToken);
    });

    it("その他のHTTPエラーの場合、valid: falseを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse(
          {
            error: "Internal Server Error",
          },
          { ok: false, status: 500 }
        )
      );

      const result = await validateTokenWithApi();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBe(accessToken);
    });

    it("JSONパースエラーの場合、valid: falseを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      const mockResponse = createResponse(
        {},
        { ok: false, status: 401 }
      ) as Response;
      // json()がエラーを投げるようにモック
      mockResponse.json = jest
        .fn()
        .mockRejectedValueOnce(new Error("Parse error"));
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await validateTokenWithApi();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBe(accessToken);
    });
  });

  describe("validateAccessToken", () => {
    it("トークンが存在する場合、valid: trueを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);

      const result = await validateAccessToken();

      expect(result.isValid).toBe(true);
      expect(result.accessToken).toBe(accessToken);
    });

    it("トークンが存在しない場合、valid: falseを返す", async () => {
      mockGetAccessTokenFromCookies.mockResolvedValue(null);

      const result = await validateAccessToken();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBeNull();
    });
  });

  describe("handleAuthFailure", () => {
    it("ログアウトページにリダイレクトする", async () => {
      await handleAuthFailure();

      expect(mockRedirect).toHaveBeenCalledWith(
        "/auth/logout?reason=session_expired"
      );
    });
  });

  describe("ensureValidToken", () => {
    it("有効なトークンがある場合、そのトークンを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);

      const result = await ensureValidToken();

      expect(result).toBe(accessToken);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("トークンが無効な場合、nullを返し、ログアウトページにリダイレクトする", async () => {
      mockGetAccessTokenFromCookies.mockResolvedValue(null);

      const result = await ensureValidToken();

      expect(result).toBeNull();
      expect(mockRedirect).toHaveBeenCalledWith(
        "/auth/logout?reason=session_expired"
      );
    });
  });
});
