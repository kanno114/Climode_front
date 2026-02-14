import { FadeInOnScroll } from "./FadeInOnScroll";

export function AppScreenshotSection() {
  return (
    <section className="px-6 py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              利用イメージ
            </h2>
            <p className="text-muted-foreground text-lg">
              シンプルで直感的な画面デザイン
            </p>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll className="flex justify-center">
          {/* スマホモック風プレースホルダー */}
          <div className="relative mx-auto w-[280px] sm:w-[320px]">
            {/* 外枠（スマホフレーム） */}
            <div className="rounded-[2.5rem] border-[8px] border-foreground/90 bg-background p-2 shadow-2xl">
              {/* ノッチ */}
              <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-foreground/90" />
              {/* 画面コンテンツ */}
              <div className="rounded-[1.5rem] bg-muted/50 p-4 space-y-4 min-h-[480px]">
                {/* ヘッダーバー */}
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-foreground/20" />
                  <div className="h-6 w-6 rounded-full bg-foreground/10" />
                </div>
                {/* シグナルカード */}
                <div className="rounded-xl bg-background p-4 space-y-3 shadow-sm">
                  <div className="h-3 w-24 rounded bg-blue-400/40" />
                  <div className="h-10 w-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg">
                      ☀
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-full rounded bg-foreground/10" />
                    <div className="h-2.5 w-3/4 rounded bg-foreground/10" />
                  </div>
                </div>
                {/* 体調記録カード */}
                <div className="rounded-xl bg-background p-4 space-y-3 shadow-sm">
                  <div className="h-3 w-20 rounded bg-green-400/40" />
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded-lg bg-foreground/5 border border-border" />
                    <div className="h-8 flex-1 rounded-lg bg-foreground/5 border border-border" />
                    <div className="h-8 flex-1 rounded-lg bg-foreground/5 border border-border" />
                  </div>
                </div>
                {/* 提案カード */}
                <div className="rounded-xl bg-background p-4 space-y-2 shadow-sm">
                  <div className="h-3 w-16 rounded bg-orange-400/40" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-foreground/10" />
                    <div className="h-2 w-5/6 rounded bg-foreground/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <p className="text-center text-sm text-muted-foreground mt-8">
            ※ 実際の画面イメージです（開発中のため変更される場合があります）
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
