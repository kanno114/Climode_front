import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import type { WeeklyReportSignals } from "../types";

interface WeeklySignalSummaryProps {
  signals: WeeklyReportSignals;
}

export function WeeklySignalSummary({ signals }: WeeklySignalSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          シグナル発生傾向
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 総発火数 */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            総発火数
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {signals.total}
          </p>
        </div>

        {/* トリガー別内訳 */}
        {signals.by_trigger.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              トリガー別内訳
            </p>
            <div className="space-y-3">
              {signals.by_trigger.map((trigger) => (
                <div
                  key={trigger.trigger_key}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {trigger.trigger_key.replace(/_/g, " ")}
                    </span>
                    <Badge variant="secondary">{trigger.count}回</Badge>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {trigger.strong > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        強: {trigger.strong}
                      </Badge>
                    )}
                    {trigger.warning > 0 && (
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                        警戒: {trigger.warning}
                      </Badge>
                    )}
                    {trigger.attention > 0 && (
                      <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                        注意: {trigger.attention}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {signals.by_trigger.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            今週はシグナルが検出されませんでした
          </p>
        )}
      </CardContent>
    </Card>
  );
}

