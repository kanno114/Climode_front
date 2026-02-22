"use server";

import { signOut } from "@/auth";
import { clearAuthCookiesAction } from "@/app/(auth)/auth-actions";

export async function logout() {
  await clearAuthCookiesAction();
  await signOut({ redirectTo: "/signin" });
}
