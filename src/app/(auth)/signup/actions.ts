"use server";

import { signIn } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { signUpSchema } from "@/lib/schemas/signup";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function getPrefectures() {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL_SERVER}/api/v1/prefectures`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "force-cache",
      }
    );

    if (res.ok) {
      return await res.json();
    } else {
      console.error("都道府県データ取得失敗:", res.status);
      return null;
    }
  } catch (error) {
    console.error("都道府県データ取得エラー:", error);
    return null;
  }
}

export async function signUpAction(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply({
      formErrors: ["入力内容を確認してください"],
    });
  }

  const { name, email, password, prefecture_id } = submission.payload;

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
            prefecture_id: prefecture_id ? parseInt(prefecture_id, 10) : null,
          },
        }),
      }
    );

    if (!backendSignUpResponse.ok) {
      const errorData = await backendSignUpResponse.json();
      console.error("登録失敗:", errorData.errors || errorData);

      // Railsからのエラーメッセージを処理
      let errorMessages: string[] = [];

      if (errorData.errors) {
        // Railsのバリデーションエラーの場合
        if (typeof errorData.errors === "object") {
          // フィールド別のエラーメッセージを配列に変換
          Object.values(errorData.errors).forEach((fieldErrors: unknown) => {
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else if (typeof fieldErrors === "string") {
              errorMessages.push(fieldErrors);
            }
          });
        } else if (Array.isArray(errorData.errors)) {
          errorMessages = errorData.errors;
        }
      } else if (errorData.error) {
        // 単一のエラーメッセージの場合
        errorMessages = [errorData.error];
      } else if (errorData.message) {
        // messageフィールドの場合
        errorMessages = [errorData.message];
      } else {
        // デフォルトエラーメッセージ
        errorMessages = ["登録に失敗しました"];
      }

      return submission.reply({
        formErrors: errorMessages,
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
      const errorData = await backendSignInResponse.json().catch(() => ({}));
      console.error("Rails API認証失敗:", {
        status: backendSignInResponse.status,
        error: errorData.error || errorData.details,
      });

      // Rails側のエラーメッセージをそのまま使用
      const errorMessage =
        errorData.error ||
        errorData.details ||
        "メールアドレスまたはパスワードが正しくありません";

      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    const userData = await backendSignInResponse.json();
    const {
      user: signedInUser,
      access_token,
      refresh_token,
      expires_in,
    } = userData;

    // Railsトークンをクッキーへ保存（Railsサインイン確立）
    if (access_token && refresh_token) {
      await setAuthCookies({
        accessToken: access_token,
        refreshToken: refresh_token,
        accessTokenMaxAgeSec:
          typeof expires_in === "number"
            ? Math.max(60, Math.min(expires_in, 60 * 60))
            : 60 * 10,
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
      console.error("ログイン失敗:", frontendSignInResult.error);
      return submission.reply({
        formErrors: ["認証に失敗しました"],
      });
    }
  } catch (error: unknown) {
    console.error(
      "予期しないエラーが発生しました:",
      error instanceof Error ? error.message : String(error)
    );
    return submission.reply({
      formErrors: ["予期しないエラーが発生しました"],
    });
  }

  if (submission.status === "success") {
    redirect("/onboarding/welcome");
  }
}
