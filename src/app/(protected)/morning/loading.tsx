import { Loading } from "@/components/ui/loading";

export default function MorningLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="h-9 w-60 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-2" />
            <div className="h-7 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
          </div>

          {/* フォームスケルトン */}
          <div className="space-y-4 w-full">
            {/* 睡眠時間 */}
            <div className="space-y-2">
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>

            {/* 気分 */}
            <div className="space-y-2">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* 疲労感 */}
            <div className="space-y-2">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="h-11 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>

          <div className="mt-8">
            <Loading size="lg" text="データを読み込み中..." />
          </div>
        </div>
      </div>
    </div>
  );
}
