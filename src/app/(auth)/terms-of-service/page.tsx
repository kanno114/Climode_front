import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            利用規約
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Climode（以下「本アプリ」）
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold">1. サービスの概要</h2>
            <p>
              本アプリ「Climode」は、個人開発者（以下「運営者」）が提供する健康管理アプリケーションです。睡眠・気分・疲労度などの身体データと、天気・気圧・湿度などの環境データを統合して体調をスコア化し、日々の体調管理を支援することを目的としています。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. 利用条件</h2>
            <p>
              本アプリの利用にあたり、ユーザーは本利用規約に同意したものとみなします。
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                本アプリを利用するには、アカウント登録が必要です。登録にはメールアドレスまたはGoogleアカウントを使用します。
              </li>
              <li>
                ユーザーは、正確な情報を提供し、アカウント情報を適切に管理する責任を負います。
              </li>
              <li>
                未成年の方が利用する場合は、保護者の同意を得た上でご利用ください。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. 禁止事項</h2>
            <p>ユーザーは、以下の行為を行ってはなりません。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>法令または公序良俗に反する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>
                本アプリのサーバーやネットワークに過度な負荷をかける行為
              </li>
              <li>
                本アプリの運営を妨害する行為、またはそのおそれのある行為
              </li>
              <li>不正アクセスまたはこれを試みる行為</li>
              <li>他のユーザーのアカウントを使用する行為</li>
              <li>
                本アプリを通じて取得した情報を、本アプリの目的外で利用する行為
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. 免責事項</h2>
            <p>
              本アプリが提供するサジェスチョン、週次レポート等の情報は、健康管理の参考としてご利用いただくものであり、
              <strong>医学的な助言や診断を提供するものではありません</strong>。
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                本アプリの情報に基づいて行った判断や行動について、運営者は一切の責任を負いません。
              </li>
              <li>
                体調に異常を感じた場合は、医療機関への相談をお勧めします。
              </li>
              <li>
                天気・気圧データは外部API（Open-Meteo）から取得しており、その正確性を保証するものではありません。
              </li>
              <li>
                本アプリの利用により生じたいかなる損害についても、運営者は責任を負いかねます。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              5. サービスの変更・中断・終了
            </h2>
            <p>
              運営者は、以下の場合において、事前の通知なくサービスの全部または一部を変更、中断、または終了することがあります。
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>システムの保守・点検を行う場合</li>
              <li>
                天災、障害等の不可抗力によりサービスの提供が困難な場合
              </li>
              <li>その他、運営者がやむを得ないと判断した場合</li>
            </ul>
            <p>
              これらに起因してユーザーに生じた損害について、運営者は責任を負いかねます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. 知的財産権</h2>
            <p>
              本アプリに関する著作権、商標権その他の知的財産権は、運営者または正当な権利者に帰属します。ユーザーは、本アプリのコンテンツを私的利用の範囲を超えて複製、転載、改変等を行うことはできません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              7. ユーザーデータの取り扱い
            </h2>
            <p>
              ユーザーの個人情報およびデータの取り扱いについては、
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. 利用規約の変更</h2>
            <p>
              運営者は、必要に応じて本規約を変更することがあります。変更後の規約は、本ページに掲載した時点で効力を生じるものとします。重要な変更がある場合は、アプリ内で通知します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. 準拠法・管轄裁判所</h2>
            <p>
              本規約の解釈および適用は、日本法に準拠するものとします。本アプリに関して紛争が生じた場合は、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. お問い合わせ</h2>
            <p>
              利用規約に関するお問い合わせは、以下のメールアドレスまでご連絡ください。
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
