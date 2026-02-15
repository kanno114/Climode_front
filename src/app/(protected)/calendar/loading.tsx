import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="space-y-4">
          {/* ヘッダー */}
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </div>

          {/* 凡例 */}
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>

          {/* サマリーカード */}
          <div className="rounded-xl border bg-card py-6 px-6 shadow-sm">
            <div className="space-y-4">
              <Skeleton className="h-5 w-28" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center space-y-1">
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* カレンダーカード */}
          <div className="rounded-xl border bg-card py-6 px-6 shadow-sm">
            {/* 月表示・ナビゲーション */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-12 rounded" />
              </div>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>

            {/* カレンダーグリッド（5週分） */}
            {Array.from({ length: 5 }).map((_, week) => (
              <div key={week} className="grid grid-cols-7 gap-1 mb-1">
                {Array.from({ length: 7 }).map((_, day) => (
                  <Skeleton key={day} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
