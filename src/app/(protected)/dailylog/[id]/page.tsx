import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { DailyLogDetailArea } from "./_components/DailyLogDetailArea";
import { Loading } from "@/components/ui/loading";

export default async function DailyLogPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Suspense
          fallback={
          <Card>
            <CardHeader>
                <CardTitle>記録を読み込み中...</CardTitle>
                <CardDescription>
                  その日の入力内容・シグナル・行動提案を準備しています。
                </CardDescription>
            </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <Loading text="少しお待ちください…" />
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
