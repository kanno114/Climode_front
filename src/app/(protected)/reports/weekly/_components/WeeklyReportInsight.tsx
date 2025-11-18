import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface WeeklyReportInsightProps {
  insight: string;
}

export function WeeklyReportInsight({ insight }: WeeklyReportInsightProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          今週のまとめ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {insight}
        </p>
      </CardContent>
    </Card>
  );
}

