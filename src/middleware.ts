import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { pathname, origin } = request.nextUrl;
  if (pathname.startsWith("/dashboard") && !request.auth) {
    return NextResponse.redirect(
      new URL("/signin?message=login_required", origin)
    );
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
