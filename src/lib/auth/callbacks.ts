// 認証のコールバック関数を定義するファイル

import type { NextAuthConfig } from "next-auth";
import type { Account, User } from "next-auth";
import { setAuthCookies } from "@/lib/auth/cookies";

const DEFAULT_TOKEN_MAX_AGE_SEC = 60 * 60 * 24 * 30;

// --- 純粋関数 ---

export function buildOAuthRequestBody(user: User, account: Account | null | undefined) {
  return {
    user: {
      email: user.email,
      name: user.name,
      image: user.image,
      provider: account?.provider,
      uid: account?.providerAccountId,
    },
  };
}

export function mapOAuthResponse(data: Record<string, unknown>) {
  const userData = data?.user as Record<string, unknown> | undefined;
  return {
    userId: (userData?.id ?? data?.id) as string | undefined,
    accessToken: data?.access_token as string | undefined,
    expiresIn:
      typeof data?.expires_in === "number"
        ? data.expires_in
        : DEFAULT_TOKEN_MAX_AGE_SEC,
  };
}

// --- コールバック（副作用） ---

export const callbacks: NextAuthConfig["callbacks"] = {
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
            body: JSON.stringify(buildOAuthRequestBody(user, account)),
          }
        );

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        const { userId, accessToken, expiresIn } = mapOAuthResponse(data);

        if (userId) {
          user.id = userId;
        }

        if (accessToken) {
          await setAuthCookies({
            accessToken,
            accessTokenMaxAgeSec: expiresIn,
          });
        }
      } catch {
        return false;
      }
    }
    return true;
  },

  async jwt({ token, user }) {
    if (user) {
      token.user = {
        ...user,
        emailVerified: null,
      };
    }
    return token;
  },

  async session({ session, token }) {
    if (token.user) {
      session.user = token.user;
    }
    return session;
  },
};
