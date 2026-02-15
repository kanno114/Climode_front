"use server";

import { signIn } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { signUpSchema } from "@/lib/schemas/signup";
import { setAuthCookies } from "@/lib/auth/cookies";
import { parseApiError } from "@/lib/api/parse-error";

export async function signUpAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["入力内容を確認してください"],
    });
  }

  const { name, email, password } = submission.payload;

  try {
    const backendSignUpResponse = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user: {
            name,
            email,
            password,
            password_confirmation: submission.payload.confirmPassword,
          },
        }),
      }
    );

    if (!backendSignUpResponse.ok) {
      const errorMessage = await parseApiError(
        backendSignUpResponse,
        "登録に失敗しました",
      );
      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    // 登録成功後、自動ログイン
    const backendSignInResponse = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: { email, password },
        }),
      }
    );

    // Rails APIからのレスポンスを処理
    if (!backendSignInResponse.ok) {
      const errorMessage = await parseApiError(
        backendSignInResponse,
        "メールアドレスまたはパスワードが正しくありません",
      );
      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    const userData = await backendSignInResponse.json();
    const {
      user: signedInUser,
      access_token,
      expires_in,
    } = userData;

    // Railsトークンをクッキーへ保存
    if (access_token) {
      await setAuthCookies({
        accessToken: access_token,
        accessTokenMaxAgeSec:
          typeof expires_in === "number" ? expires_in : 60 * 60 * 24 * 30,
      });
    }

    // 認証成功時はAuth.jsでセッション確立
    const frontendSignInResult = await signIn("credentials", {
      email,
      password,
      id: signedInUser?.id,
      name: signedInUser?.name,
      redirect: false,
    });

    if (frontendSignInResult?.error) {
      return submission.reply({
        formErrors: ["認証に失敗しました"],
      });
    }
  } catch {
    return submission.reply({
      formErrors: ["予期しないエラーが発生しました"],
    });
  }

  if (submission.status === "success") {
    redirect("/onboarding/welcome");
  }
}
