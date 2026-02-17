import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" aria-busy="true" aria-label="読み込み中">
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="space-y-4">
          {/* 挨拶セクション */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* 提案スケルトン */}
          <div className="rounded-xl border bg-card py-6 px-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-40" />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-l-4 p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* 天気予報スケルトン */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="rounded-xl border bg-card py-4 px-4 shadow-sm">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full mb-2 last:mb-0" />
              ))}
            </div>
          </div>

          {/* UpcomingFeaturesスケルトン */}
          <div className="rounded-xl border border-dashed bg-card py-6 px-6 shadow-sm space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
