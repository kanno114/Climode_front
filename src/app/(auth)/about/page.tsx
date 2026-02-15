import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { EVIDENCE_CATEGORIES } from "./_data/evidence-sources";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            提案ロジックと参照エビデンス
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Climode
            では、以下の公的機関のデータ、学術研究、専門家の知見を参考に、独自のアルゴリズムで解析・提案を行っています。
          </p>
        </div>

        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>必ずお読みください</AlertTitle>
          <AlertDescription>
            本サービスの提案は、健康管理の目安として提供するものであり、医療行為や医師の診断を代替するものではありません。体調に異変を感じた場合は、専門機関にご相談ください。
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {EVIDENCE_CATEGORIES.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-normal">
                  {category.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.sources.map((source, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </p>
                    {source.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {source.description}
                      </p>
                    )}
                    {source.url && (
                      <Link
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        公式サイト
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
