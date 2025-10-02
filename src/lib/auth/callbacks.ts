// 認証のコールバック関数を定義するファイル

import { NextAuthConfig } from "next-auth";
import { setAuthCookies } from "@/lib/auth/cookies";

export const callbacks: NextAuthConfig["callbacks"] = {
  // OAuth成功後、Railsへユーザー同期
  async signIn({ user, account }) {
    if (account?.provider !== "credentials") {
      try {
        const response = await fetch(
          `${process.env.API_BASE_URL_SERVER}/api/v1/oauth_register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              user: {
                email: user.email,
                name: user.name,
                image: user.image,
                provider: account?.provider,
                uid: account?.providerAccountId,
              },
            }),
          }
        );

        if (!response.ok) {
          console.error("RailsへのOAuth登録失敗:", await response.text());
          return false;
        }

        const data = await response.json();
        // ユーザーIDを設定（data.user.id 形式と data.id 形式の両対応）
        user.id = data?.user?.id ?? data?.id;

        // RailsからのJWTを保存してRails側のサインイン状態を確立
        const access_token = data?.access_token;
        const refresh_token = data?.refresh_token;
        const expires_in = data?.expires_in;

        if (access_token && refresh_token) {
          await setAuthCookies({
            accessToken: access_token,
            refreshToken: refresh_token,
            accessTokenMaxAgeSec:
              typeof expires_in === "number"
                ? Math.max(60, Math.min(expires_in, 60 * 60))
                : 60 * 10,
          });
        }
      } catch (err) {
        console.error("RailsへのOAuth登録失敗:", err);
        return false;
      }
    }
    return true;
  },

  // JWTにユーザー情報を保持
  async jwt({ token, user }) {
    if (user) {
      token.user = {
        ...user,
        emailVerified: null, // 必要に応じて適切な値を設定
      };
    }
    return token;
  },

  // セッションにユーザー情報を展開
  async session({ session, token }) {
    if (token.user) {
      session.user = token.user;
    }
    return session;
  },
};
