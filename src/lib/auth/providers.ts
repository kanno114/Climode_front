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
      id: { label: "ID", type: "text" },
      name: { label: "Name", type: "text" },
      image: { label: "Image", type: "text" },
    },
    async authorize(credentials) {
      try {
        // Server Actionで既に認証済みなので、ユーザー情報のみ返す
        return {
          id: credentials?.id as string,
          email: credentials?.email as string,
          name: credentials?.name as string | null,
          image: credentials?.image as string | null,
        };
      } catch (error) {
        console.error("認証エラー:", error);
        return null;
      }
    },
  }),
];
