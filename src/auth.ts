import NextAuth, { NextAuthConfig } from "next-auth";
import { providers } from "@/lib/auth/providers";
import { callbacks } from "@/lib/auth/callbacks";
import { authConfig } from "@/lib/auth/config";

export const config: NextAuthConfig = {
  providers,
  callbacks,
  ...authConfig,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
