import { Card, CardContent } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-8 px-4" aria-busy="true" aria-label="読み込み中">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2" />
        </div>

        {/* TabsList スケルトン */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 mb-4">
          <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
        </div>

        {/* TabsContent スケルトン（プロフィールタブ相当） */}
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-6">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
