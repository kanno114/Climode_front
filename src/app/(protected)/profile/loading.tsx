import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-9 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2" />
        </div>

        <div className="space-y-6">
          {/* プロフィールフォームスケルトン */}
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="space-y-6 pt-6">
              {/* ニックネーム */}
              <div className="space-y-2">
                <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
              {/* 都道府県 */}
              <div className="space-y-2">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
              {/* ボタン */}
              <div className="flex justify-end">
                <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Loading size="lg" text="プロフィールを読み込み中..." />
        </div>
      </div>
    </div>
  );
}
