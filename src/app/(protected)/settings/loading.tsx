import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-8 px-4" aria-busy="true" aria-label="読み込み中">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2" />
        </div>

        <div className="space-y-8">
          {/* アカウント情報スケルトン */}
          <section>
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
            <Card className="mb-4">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card className="w-full max-w-2xl mx-auto">
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="flex justify-end">
                  <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </section>

          <Loading size="lg" text="設定を読み込み中..." />
        </div>
      </div>
    </div>
  );
}
