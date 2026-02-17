import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-5 w-80" />
              </div>
              <div className="w-full md:w-60">
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* TutorialPanel skeleton */}
              <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
              {/* Form panel skeleton */}
              <div className="rounded-lg border p-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </div>
            {/* Step badges skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-9 w-28 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-9 w-32 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
