import { Suspense } from "react";
import { DailyLogDetailArea } from "./_components/DailyLogDetailArea";
import { Loading } from "@/components/ui/loading";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function DailyLogPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          カレンダーに戻る
        </Link>

        <Suspense
          fallback={
            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <Loading text="記録を読み込み中…" />
              </CardContent>
            </Card>
          }
        >
          <DailyLogDetailArea id={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
