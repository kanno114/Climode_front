import { getDailyLog } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyLogDetailArea } from "./_components/DailyLogDetailArea";

export default async function DailyLogPage({ params }: { params: { id: string } }) {
  const dailyLog = await getDailyLog(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {!dailyLog ? (
          <Card>
            <CardHeader>
              <CardTitle>記録が見つかりません</CardTitle>
              <CardDescription>指定の記録は存在しないか、参照権限がありません。</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ダッシュボードから記録を作成してください。</p>
            </CardContent>
          </Card>
        ) : (
          <DailyLogDetailArea dailyLog={dailyLog} />
        )}
      </div>
    </div>
  );
}