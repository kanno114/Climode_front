// 認証プロバイダーを定義するファイル

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// 環境変数の検証
const googleClientId = process.env.AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_CLIENT_SECRET;

if (!googleClientId) {
  throw new Error("Missing AUTH_GOOGLE_CLIENT_ID");
}

if (!googleClientSecret) {
  throw new Error("Missing AUTH_GOOGLE_CLIENT_SECRET");
}

export const providers = [
  Google({
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  }),
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        console.log("認証開始:", { email: credentials?.email });

        const res = await fetch(
          `${process.env.API_BASE_URL_SERVER}/api/v1/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              user: {
                email: credentials?.email,
                password: credentials?.password,
              },
            }),
          }
        );

        console.log("Rails API レスポンス:", {
          status: res.status,
          ok: res.ok,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(
            "通常ログイン失敗 - HTTPエラー:",
            res.status,
            errorText
          );
          return null;
        }

        const data = await res.json();
        console.log("認証成功:", { id: data.id, email: data.email });
        return data;
      } catch (error) {
        console.error("通常ログイン失敗:", error);
        return null;
      }
    },
  }),
];
