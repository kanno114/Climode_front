// 認証の設定を定義するファイル

import { NextAuthConfig } from "next-auth";

export const authConfig: Partial<NextAuthConfig> = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  basePath: "/api/auth",

  pages: {
    // 認証が必要なページに未ログインでアクセスしたときのリダイレクト先
    signIn: "/signin",
    // 認証処理中に発生したエラーをユーザーに知らせるためのページを表示します。
    error: "/error",
    // ログアウトが行われる前に確認や処理がしたい場合
    // signOut: "/",
    // メールリンク認証（パスワードレスログイン）を使った場合に、メール送信後に表示される案内ページ。
    // verifyRequest: "/",
    // OAuth認証を使ったユーザーが初めてログインした際に表示される「アカウント作成の確認ページ」。
    // newUser: null
  },
};
