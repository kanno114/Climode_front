"use server";

import { signIn } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { signInSchema } from "@/lib/schemas/signin"; // 共通スキーマをインポート

export async function signInAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signInSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password } = submission.payload;

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("登録失敗:", errorData.errors || errorData);
      return;
    }

    // NextAuth側のセッション確立（credentials）
    await signIn("credentials", { email, password, redirect: false });
  } catch (error: unknown) {
    console.error(
      "予期しないエラーが発生しました:",
      error instanceof Error ? error.message : String(error)
    );
  }
  redirect("/dashboard");
}
