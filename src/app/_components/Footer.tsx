import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* サービス名 */}
          <p className="font-semibold text-lg">Climode</p>

          {/* リンク */}
          <div className="flex gap-6">
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Climode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
