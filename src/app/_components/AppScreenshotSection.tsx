import Image from "next/image";
import { FadeInOnScroll } from "./FadeInOnScroll";

const screenshots = [
  {
    src: "/screenshots/dashboard.png",
    alt: "Climodeダッシュボード - 行動提案と天気予報",
    label: "ダッシュボード",
  },
  {
    src: "/screenshots/morning-log.png",
    alt: "Climode朝の記録 - 睡眠・気分・疲労感の入力",
    label: "朝の記録",
  },
];

export function AppScreenshotSection() {
  return (
    <section className="px-6 py-24 bg-muted/30">
      <div className="max-w-5xl mx-auto">
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

        <FadeInOnScroll>
          <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory justify-start sm:justify-center px-4 sm:px-0 -mx-4 sm:mx-0">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.src}
                className="flex-shrink-0 snap-center flex flex-col items-center gap-3"
              >
                {/* スマホフレーム */}
                <div className="relative w-[220px] sm:w-[250px]">
                  <div className="rounded-[2rem] border-[6px] border-foreground/90 bg-background p-1.5 shadow-2xl">
                    {/* ノッチ */}
                    <div className="mx-auto mb-2 h-4 w-20 rounded-full bg-foreground/90" />
                    {/* スクリーンショット */}
                    <div className="rounded-[1.2rem] overflow-hidden">
                      <Image
                        src={screenshot.src}
                        alt={screenshot.alt}
                        width={390}
                        height={844}
                        className="w-full h-auto"
                        quality={85}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {screenshot.label}
                </span>
              </div>
            ))}
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <p className="text-center text-sm text-muted-foreground mt-8">
            ※ 実際の画面イメージです
          </p>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
