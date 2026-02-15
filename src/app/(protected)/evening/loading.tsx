import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

export default function EveningLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="h-9 w-80 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-2" />
            <div className="h-7 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
          </div>

          {/* 提案カードスケルトン */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </CardContent>
            </Card>

            {/* セルフスコアスケルトン */}
            <Card>
              <CardHeader>
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>

            {/* メモスケルトン */}
            <Card>
              <CardHeader>
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Loading size="lg" text="データを読み込み中..." />
          </div>
        </div>
      </div>
    </div>
  );
}
