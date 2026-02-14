import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { HeroSection } from "./_components/HeroSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { AppScreenshotSection } from "./_components/AppScreenshotSection";
import { HowItWorksSection } from "./_components/HowItWorksSection";
import { Footer } from "./_components/Footer";
import { FadeInOnScroll } from "./_components/FadeInOnScroll";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <HeroSection session={session} />
      <FeaturesSection />
      <AppScreenshotSection />
      <HowItWorksSection />

      {/* CTAセクション */}
      <section className="px-6 py-24 bg-muted/30">
        <FadeInOnScroll>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              今すぐ始めましょう
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              体調のゆらぎを理解して、毎日を整えるリズムをつくりませんか？
            </p>
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
        </FadeInOnScroll>
      </section>

      <Footer />
    </div>
  );
}
