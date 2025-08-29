import { DefaultSession, DefaultUser } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: {
      id: string;
      name?: string | null;
      email: string;
      role?: string | null;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }
}
