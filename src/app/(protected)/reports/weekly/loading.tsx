import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

export default function WeeklyReportLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" aria-busy="true" aria-label="読み込み中">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                週間レポート
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                体調推移とレポートを確認できます
              </p>
            </div>
          </div>
        </div>

        {/* Date range & navigation skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>

        {/* Tab bar skeleton */}
        <div className="flex gap-1 mb-6">
          {["w-20", "w-24", "w-24", "w-16"].map((w, i) => (
            <Skeleton key={i} className={`h-9 ${w} rounded-md`} />
          ))}
        </div>

        {/* Summary tab skeleton */}
        <div className="space-y-6">
          {/* Key metrics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <Skeleton className="h-5 w-5 rounded-full mx-auto mb-2" />
                <Skeleton className="h-3 w-12 mx-auto mb-2" />
                <Skeleton className="h-6 w-10 mx-auto" />
              </div>
            ))}
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-6 shadow-sm space-y-4"
              >
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Correlation card */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <Skeleton className="h-5 w-24" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
