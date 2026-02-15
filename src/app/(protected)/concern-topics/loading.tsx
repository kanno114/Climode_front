import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ConcernTopicsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ページヘッダー */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-72" />
        </div>

        {/* 関心ワードカード */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
