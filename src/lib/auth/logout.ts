"use server";

import { clearAuthCookiesAction } from "@/app/(auth)/auth-actions";
import { redirect } from "next/navigation";

export async function logout() {
  await clearAuthCookiesAction();
  redirect("/signin");
}
