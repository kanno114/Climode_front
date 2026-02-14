import { FadeInOnScroll } from "./FadeInOnScroll";

const steps = [
  {
    number: "1",
    title: "朝の体調入力",
    description:
      "睡眠時間・気分・疲労感を簡単に入力。環境データと組み合わせて、今日に合った提案が自動で届きます。",
  },
  {
    number: "2",
    title: "夜の振り返り",
    description:
      "提案が役立ったかフィードバックし、セルフスコアと出来事を記録。1分で完了するシンプルな振り返りです。",
  },
  {
    number: "3",
    title: "週次レポートで気づき",
    description:
      "週単位のレポートで体調の傾向や相関を可視化。自分のリズムやパターンを理解して、日々の行動を調整できます。",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              利用の流れ
            </h2>
            <p className="text-muted-foreground text-lg">
              朝と夜の2回だけのシンプルなリズム
            </p>
          </div>
        </FadeInOnScroll>

        <div className="relative">
          {/* 縦ライン */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <FadeInOnScroll key={step.number}>
                <div className="flex gap-6 items-start">
                  {/* 番号 */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  {/* コンテンツ */}
                  <div className={index < steps.length - 1 ? "pb-2" : ""}>
                    <h3 className="font-semibold text-xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
