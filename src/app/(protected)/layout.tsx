import { Header } from "./_components/Header";
import {
  validateTokenWithApi,
  refreshAccessToken,
  handleAuthFailure,
} from "@/lib/auth/token-validator";
import { setAuthCookies } from "@/lib/auth/cookies";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rails APIトークンの有効性をAPIで確認（NextAuthセッションチェックは削除）
  const tokenValidation = await validateTokenWithApi();

  if (!tokenValidation.isValid) {
    if (tokenValidation.needsRefresh) {
      // トークンが期限切れの場合、リフレッシュを試行
      const refreshResult = await refreshAccessToken();

      if (refreshResult.success && refreshResult.newAccessToken) {
        // リフレッシュ成功：Cookieを更新
        await setAuthCookies({
          accessToken: refreshResult.newAccessToken,
          refreshToken: refreshResult.newRefreshToken || "",
        });
        // レイアウトを続行
      } else {
        // リフレッシュ失敗：ログアウトページへ
        await handleAuthFailure();
        return null;
      }
    } else {
      // トークンが無効（リフレッシュ不可）
      await handleAuthFailure();
      return null;
    }
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
