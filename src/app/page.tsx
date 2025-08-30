import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Climode</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            睡眠・気分・症状などの身体データと、天気・気圧・花粉・PM2.5
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
      </main>
    </div>
  );
}
