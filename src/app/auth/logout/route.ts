import { cookies } from "next/headers";
import { signOut } from "@/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reason = url.searchParams.get("reason");

  const cs = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  // Cookie をクリア
  cs.set("access_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  cs.set("refresh_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // NextAuth のセッションも破棄してリダイレクト
  const redirectTo =
    reason === "session_expired"
      ? "/signin?message=session_expired"
      : "/signin";

  return signOut({ redirectTo });
}
