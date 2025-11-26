import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TodayArea } from "./_components/TodayArea";
import { TriggerSetupAlert } from "./_components/TriggerSetupAlert";
import { UpcomingFeatures } from "./_components/UpcomingFeatures";
import { auth } from "@/auth";
import { fetchUserTriggers } from "@/lib/api/triggers";
import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  let hasNoUserTriggers = false;
  try {
    const userTriggers = await fetchUserTriggers(userId);
    hasNoUserTriggers = userTriggers.length === 0;
  } catch {
    // API失敗時は未登録扱いのUIを出す（厳密でなくUX優先）
    hasNoUserTriggers = true;
  }

  return (
    <div className="min-h-screen bg-[#f2f6ff] dark:bg-[#0d111c]">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="space-y-6">
          <TriggerSetupAlert hasNoUserTriggers={hasNoUserTriggers} />

          <Suspense fallback={<TodayAreaSkeleton />}>
            <TodayArea />
          </Suspense>

          <UpcomingFeatures />
        </div>
      </div>
    </div>
  );
}

// ローディングUI
function TodayAreaSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="py-12">
        <Loading size="lg" text="データを読み込み中..." />
      </CardContent>
    </Card>
  );
}
