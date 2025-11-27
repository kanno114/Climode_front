import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { AppDescription } from "./_components/AppDescription";

export default async function Home() {
  const session = await auth();

  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col items-center gap-12 max-w-6xl mx-auto">
        {/* ヘッダーセクション */}
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold mb-4">Climode</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            睡眠・気分・症状などの身体データと、天気・気圧・湿度
            などの環境データを統合して体調をスコア化する健康管理アプリ
          </p>
          {/* 挨拶メッセージ */}
          {session?.user && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              ようこそ、{session.user.name || session.user.email}さん
            </p>
          )}
          {/* 認証ボタン */}
          <div className="flex gap-4 justify-center">
            {session?.user ? (
              // ログイン済みの場合
              <Button asChild>
                <Link href="/dashboard">ダッシュボード</Link>
              </Button>
            ) : (
              // 未ログインの場合
              <>
                <Button asChild>
                  <Link href="/signin">ログイン</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">新規登録</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* アプリ説明セクション */}
        <AppDescription />
      </main>
    </div>
  );
}
