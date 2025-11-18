import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { pathname, origin } = request.nextUrl;

  const requiresAuth =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/setup/triggers") ||
    pathname.startsWith("/onboarding/welcome") ||
    pathname.startsWith("/morning");

  if (requiresAuth && !request.auth) {
    return NextResponse.redirect(
      new URL("/signin?message=login_required", origin)
    );
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/setup/triggers",
    "/onboarding/welcome",
    "/morning/:path*",
    "/signin",
    "/signup",
  ],
};
