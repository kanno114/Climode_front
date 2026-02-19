import { Skeleton } from "@/components/ui/skeleton";
import { TodayArea } from "./_components/TodayArea";
import { EmailConfirmationBanner } from "@/components/EmailConfirmationBanner";
import { auth } from "@/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProfileAction } from "@/app/(protected)/settings/actions";

async function requireOnboardingComplete() {
  const profile = await getProfileAction();
  const hasPrefecture = profile?.user?.prefecture_id != null;
  if (!hasPrefecture) {
    redirect("/onboarding/welcome");
  }
  return profile;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?message=login_required");
  }

  const profile = await requireOnboardingComplete();
  const emailConfirmed = profile?.user?.email_confirmed !== false;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="space-y-6">
          {!emailConfirmed && <EmailConfirmationBanner />}

          <Suspense fallback={<TodayAreaSkeleton />}>
            <TodayArea />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// ローディングUI（セクション分離レイアウトに対応）
function TodayAreaSkeleton() {
  return (
    <div className="space-y-4">
      {/* 挨拶セクション */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* 提案スケルトン */}
      <div className="rounded-xl border bg-card py-6 px-6 shadow-sm space-y-4">
        <Skeleton className="h-6 w-40" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-l-4 p-3 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* 天気予報スケルトン */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="rounded-xl border bg-card py-4 px-4 shadow-sm">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full mb-2 last:mb-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
