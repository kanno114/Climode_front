import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";

interface HeroSectionProps {
  session: Session | null;
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* グラデーション背景 */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #f0f7ff 40%, #e8f1fd 100%)",
        }}
      />
      <div
        className="dark:block hidden absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #0d1525 40%, #111d33 100%)",
        }}
      />

      <div className="text-center max-w-3xl mx-auto">
        {/* ロゴ */}
        <p className="text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-6">
          Climode
        </p>

        {/* キャッチコピー */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          体調の&quot;ゆらぎ&quot;に、
          <br />
          今日の提案を届ける。
        </h1>

        {/* サブコピー */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          睡眠・気分・疲労感と気圧・気温・湿度を統合し、
          <br className="hidden sm:block" />
          あなたに合った提案を届ける健康管理アプリ
        </p>

        {/* 挨拶メッセージ */}
        {session?.user && (
          <p className="text-base text-muted-foreground mb-6">
            ようこそ、{session.user.name || session.user.email}さん
          </p>
        )}

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session?.user ? (
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/dashboard">ダッシュボードへ</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/signup">無料で始める</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8"
              >
                <Link href="/signin">ログイン</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
