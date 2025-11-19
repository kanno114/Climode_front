import {
  validateTokenWithApi,
  validateAccessToken,
  refreshAccessToken,
  ensureValidToken,
  handleAuthFailure,
} from "../token-validator";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth/cookies";
import { redirect } from "next/navigation";

// モック設定
jest.mock("@/lib/auth/cookies", () => ({
  getAccessTokenFromCookies: jest.fn(),
  getRefreshTokenFromCookies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetAccessTokenFromCookies =
  getAccessTokenFromCookies as jest.MockedFunction<
    typeof getAccessTokenFromCookies
  >;
const mockGetRefreshTokenFromCookies =
  getRefreshTokenFromCookies as jest.MockedFunction<
    typeof getRefreshTokenFromCookies
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
      expect(result.needsRefresh).toBe(false);
    });

    it("トークンが存在しない場合、valid: falseを返す", async () => {
      mockGetAccessTokenFromCookies.mockResolvedValue(null);

      const result = await validateTokenWithApi();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBeNull();
      expect(result.needsRefresh).toBe(false);
    });

    it("期限切れトークンの場合、needsRefresh: trueを返す", async () => {
      const accessToken = "expired_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse(
          {
            valid: false,
            error: "認証トークンの有効期限が切れています",
            needs_refresh: true,
          },
          { ok: false, status: 401 }
        )
      );

      const result = await validateTokenWithApi();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBe(accessToken);
      expect(result.needsRefresh).toBe(true);
    });

    it("無効なトークンの場合、needsRefresh: falseを返す", async () => {
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
      expect(result.needsRefresh).toBe(false);
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
      expect(result.needsRefresh).toBe(false);
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
      expect(result.needsRefresh).toBe(false);
    });

    it("JSONパースエラーの場合、needsRefresh: falseを返す", async () => {
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
      expect(result.needsRefresh).toBe(false);
    });
  });

  describe("validateAccessToken", () => {
    it("トークンが存在する場合、valid: trueを返す", async () => {
      const accessToken = "valid_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(accessToken);

      const result = await validateAccessToken();

      expect(result.isValid).toBe(true);
      expect(result.accessToken).toBe(accessToken);
      expect(result.needsRefresh).toBe(false);
    });

    it("トークンが存在しない場合、valid: falseを返す", async () => {
      mockGetAccessTokenFromCookies.mockResolvedValue(null);

      const result = await validateAccessToken();

      expect(result.isValid).toBe(false);
      expect(result.accessToken).toBeNull();
      expect(result.needsRefresh).toBe(false);
    });
  });

  describe("refreshAccessToken", () => {
    it("リフレッシュトークンが有効な場合、新しいアクセストークンを返す", async () => {
      const refreshToken = "valid_refresh_token";
      const newAccessToken = "new_access_token";
      mockGetRefreshTokenFromCookies.mockResolvedValue(refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse({
          access_token: newAccessToken,
          refresh_token: refreshToken,
        })
      );

      const result = await refreshAccessToken();

      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/refresh`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      );
      expect(result.success).toBe(true);
      expect(result.newAccessToken).toBe(newAccessToken);
    });

    it("リフレッシュトークンが存在しない場合、エラーを返す", async () => {
      mockGetRefreshTokenFromCookies.mockResolvedValue(null);

      const result = await refreshAccessToken();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.newAccessToken).toBeNull();
      expect(result.error).toBe("No refresh token available");
    });

    it("リフレッシュAPIがエラーを返す場合、エラーを返す", async () => {
      const refreshToken = "invalid_refresh_token";
      mockGetRefreshTokenFromCookies.mockResolvedValue(refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse(
          {
            error: "リフレッシュトークンの有効期限が切れています",
          },
          { ok: false, status: 401 }
        )
      );

      const result = await refreshAccessToken();

      expect(result.success).toBe(false);
      expect(result.newAccessToken).toBeNull();
      expect(result.error).toContain("Refresh failed");
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

    it("トークンが無効でリフレッシュに成功した場合、新しいトークンを返す", async () => {
      const refreshToken = "valid_refresh_token";
      const newAccessToken = "new_access_token";
      mockGetAccessTokenFromCookies.mockResolvedValue(null);
      mockGetRefreshTokenFromCookies.mockResolvedValue(refreshToken);
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        createResponse({
          access_token: newAccessToken,
          refresh_token: refreshToken,
        })
      );

      const result = await ensureValidToken();

      expect(result).toBe(newAccessToken);
    });

    it("トークンが無効でリフレッシュに失敗した場合、nullを返し、ログアウトページにリダイレクトする", async () => {
      mockGetAccessTokenFromCookies.mockResolvedValue(null);
      mockGetRefreshTokenFromCookies.mockResolvedValue(null);

      const result = await ensureValidToken();

      expect(result).toBeNull();
      expect(mockRedirect).toHaveBeenCalledWith(
        "/auth/logout?reason=session_expired"
      );
    });
  });
});
