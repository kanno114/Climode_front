import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-4">
        {/* ヘッダー（月表示・ナビゲーション） */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>

        {/* カレンダーグリッド（5週分） */}
        {Array.from({ length: 5 }).map((_, week) => (
          <div key={week} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, day) => (
              <Skeleton
                key={day}
                className="h-16 w-full rounded-md"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
