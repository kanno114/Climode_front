// 認証のコールバック関数を定義するファイル

import { NextAuthConfig } from "next-auth";

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
              },
            }),
          }
        );

        if (!response.ok) {
          console.error("RailsへのOAuth登録失敗:", await response.text());
          return false;
        }

        const data = await response.json();
        user.id = data.id; // レスポンスからユーザーIDを取得して設定
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
