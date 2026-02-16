import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "Climodeのプライバシーポリシーです。個人情報の取り扱いについてご確認ください。",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            プライバシーポリシー
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Climode（以下「本アプリ」）
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold">1. 運営者情報</h2>
            <p>
              本アプリ「Climode」は、個人開発者（以下「運営者」）が運営する健康管理アプリケーションです。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. 収集する個人情報</h2>
            <p>本アプリでは、以下の個人情報を収集します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>メールアドレス（アカウント登録・ログインに使用）</li>
              <li>
                Googleアカウント情報（Google
                OAuthによるログイン時に取得する名前・メールアドレス・プロフィール画像）
              </li>
              <li>
                健康データ（睡眠時間、気分、疲労度、頭痛・肩こりなどの症状記録）
              </li>
              <li>
                都道府県情報（ユーザーが登録した都道府県をもとに天気・気圧データを取得）
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. 利用目的</h2>
            <p>収集した個人情報は、以下の目的で利用します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>アカウントの作成・認証・管理</li>
              <li>日々の体調シグナルやサジェスチョンの生成・表示</li>
              <li>週次レポートの生成</li>
              <li>プッシュ通知の送信（朝のシグナル通知・夕方のリマインダー）</li>
              <li>アプリの改善・不具合対応</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. 第三者提供について</h2>
            <p>
              運営者は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. 外部サービス連携</h2>
            <p>本アプリでは、以下の外部サービスを利用しています。</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google OAuth</strong>
                ：Googleアカウントによるログイン認証に使用します。Googleのプライバシーポリシーは{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  こちら
                </a>{" "}
                をご確認ください。
              </li>
              <li>
                <strong>Open-Meteo API</strong>
                ：天気・気圧・湿度などの気象データの取得に使用します。ユーザーが登録した都道府県の情報をもとにデータを取得します。APIキーは不要であり、Open-Meteo側にユーザーの個人情報は送信されません。
              </li>
              <li>
                <strong>Google Analytics</strong>
                ：サービス改善を目的としたアクセス解析に使用します。Google
                Analyticsは、Cookieを使用してページビューやユーザーの行動データを匿名で収集します。収集されたデータはGoogleのプライバシーポリシーに基づき管理されます。詳しくは{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Googleのサービスを使用するサイトやアプリから収集した情報のGoogleによる使用
                </a>{" "}
                をご確認ください。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. データの保管・管理</h2>
            <p>
              ユーザーの個人情報および健康データは、暗号化された通信（HTTPS）を通じて送受信され、セキュリティを考慮したサーバー上のデータベースに保管されます。パスワードはハッシュ化して保存し、平文では保持しません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              7. Cookieおよびアクセスログ
            </h2>
            <p>
              本アプリでは、認証状態の管理のためにCookieを使用します。また、Google
              Analyticsによるアクセス解析のためにCookieを使用し、ページビューや利用状況に関するデータを匿名で収集します。サービスの安定運用のためにアクセスログを記録する場合があります。これらの情報は個人を特定する目的では使用しません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. ユーザーの権利</h2>
            <p>ユーザーは、以下の権利を有します。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>自己の個人情報の開示を請求する権利</li>
              <li>自己の個人情報の訂正・削除を請求する権利</li>
              <li>アカウントの削除を請求する権利</li>
            </ul>
            <p>
              これらの請求は、下記のお問い合わせ先までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              9. プライバシーポリシーの変更
            </h2>
            <p>
              運営者は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、本ページに掲載した時点で効力を生じるものとします。重要な変更がある場合は、アプリ内で通知します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. お問い合わせ</h2>
            <p>
              プライバシーポリシーに関するお問い合わせは、以下のメールアドレスまでご連絡ください。
            </p>
            <p>
              <a
                href="mailto:k.takumi114@gmail.com"
                className="text-primary hover:underline"
              >
                k.takumi114@gmail.com
              </a>
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              制定日：2025年2月14日
              <br />
              最終更新日：2026年2月16日
            </p>
          </section>

          <div className="pt-4 text-center">
            <Link href="/" className="text-primary hover:underline text-sm">
              トップページに戻る
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
