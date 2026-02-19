import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DailyLogDetailLoading() {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      aria-busy="true"
      aria-label="読み込み中"
    >
      <div className="container mx-auto px-4 py-8 space-y-4">
        {/* カレンダーに戻るリンク */}
        <Skeleton className="h-5 w-36" />

        {/* メインカード */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {/* セルフスコア */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex gap-1">
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            </div>

            {/* メトリクスグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2 rounded-lg bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>

            {/* 気象データセクション */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-3"
                  >
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 行動提案スケルトン */}
        <Card>
          <CardContent className="py-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-l-4 p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
