import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { pathname, origin } = request.nextUrl;

  // // ログイン済みユーザーが認証ページにアクセスした場合、/dashboardにリダイレクト
  // if (request.auth && (pathname === "/signin" || pathname === "/signup")) {
  //   return NextResponse.redirect(new URL("/dashboard", origin));
  // }

  // 未認証ユーザーが/dashboardにアクセスした場合、/signinにリダイレクト
  if (pathname.startsWith("/dashboard") && !request.auth) {
    return NextResponse.redirect(
      new URL("/signin?message=login_required", origin)
    );
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
