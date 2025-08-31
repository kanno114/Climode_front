import { Badge } from "@/components/ui/badge";
import { Card, CardContent} from "@/components/ui/card";

export function DailyLogScore({ score }: { score: number }) {

    let message = "";
    let className = "";

    if (score >= 80) {
      className = "bg-green-500 hover:bg-green-600 text-white";
      message = "🎉 素晴らしい体調です！";
    } else if (score >= 60 && score < 80) {
      className = "bg-blue-500 hover:bg-blue-600 text-white";
      message = "👍 良好な体調です";
    } else if (score >= 40 && score < 60) {
      className = "bg-yellow-500 hover:bg-yellow-600 text-white";
      message = "⚠️ やや注意が必要です";
    } else {
      className = "bg-red-500 hover:bg-red-600 text-white";
      message = "🚨 体調管理を意識しましょう";
    }

  return (
    <>
    {score && (
          <Card className="h-full flex justify-center">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    体調スコア
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    今日の評価
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {score}
                  </div>
                  <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                    点
                  </div>
                </div>
              </div>

              {/* スコアバー */}
              <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(Math.max(score, 0), 100)}%`,
                  }}
                />
              </div>

              {/* スコア評価 */}
              <div className="flex justify-between text-xs text-blue-600/70 dark:text-blue-400/70">
                <span>😢 0</span>
                <span>😐 50</span>
                <span>😊 100</span>
              </div>

              {/* スコアメッセージ */}
              <div className="text-center">
                <Badge
                variant="default"
                className={className}
                >
                  {message}
              </Badge>
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );
}