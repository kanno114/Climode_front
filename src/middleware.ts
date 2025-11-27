import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const requiresAuth =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/setup/triggers") ||
    pathname.startsWith("/onboarding/welcome") ||
    pathname.startsWith("/morning") ||
    pathname.startsWith("/evening");

  if (requiresAuth) {
    // Cookieからアクセストークンとリフレッシュトークンの存在をチェック
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    // アクセストークンまたはリフレッシュトークンのいずれかが存在すれば通過
    // アクセストークンが期限切れの場合、layout.tsxでリフレッシュを試みる
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(
        new URL("/signin?message=login_required", origin)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/setup/triggers",
    "/onboarding/welcome",
    "/morning/:path*",
    "/evening/:path*",
    "/signin",
    "/signup",
  ],
};
