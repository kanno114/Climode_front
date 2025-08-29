export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/posts/:path*", "/users/:path*"],
};
