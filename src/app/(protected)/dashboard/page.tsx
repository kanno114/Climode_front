import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TodayArea } from "./_components/TodayArea";
import { UpcomingFeatures } from "./_components/UpcomingFeatures";
import { auth } from "@/auth";
import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";
import { redirect } from "next/navigation";
import { getProfileAction } from "@/app/(protected)/profile/actions";

async function requireOnboardingComplete() {
  const profile = await getProfileAction();
  const hasPrefecture = profile?.user?.prefecture_id != null;
  if (!hasPrefecture) {
    redirect("/onboarding/welcome");
  }
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?message=login_required");
  }

  await requireOnboardingComplete();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="space-y-6">
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
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </CardHeader>
      <CardContent className="py-12">
        <Loading size="lg" text="データを読み込み中..." />
      </CardContent>
    </Card>
  );
}
