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
    // Cookieからアクセストークンの存在をチェック（軽量）
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
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
