import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { DailyLogForm } from "./_components/DailyLogForm";
import { TodayArea } from "./_components/TodayArea";
import {
  getTodayDailyLog,
  getSuggestions,
  getPrefectures,
  getDefaultPrefecture,
} from "./actions";

export default async function DashboardPage() {
  const todayDailyLog = await getTodayDailyLog();
  const suggestions = await getSuggestions();
  const prefectures = await getPrefectures();
  const defaultPrefecture = await getDefaultPrefecture();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 今日の記録表示または入力フォーム */}
        {todayDailyLog ? (
          <TodayArea
            dailyLog={todayDailyLog}
            suggestions={suggestions}
            prefectures={prefectures}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                今日の記録
              </CardTitle>
              <CardDescription>
                睡眠・気分・症状を記録して体調を管理しましょう
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyLogForm
                prefectures={prefectures}
                defaultPrefecture={defaultPrefecture.prefecture}
              />
            </CardContent>
          </Card>
        )}

        {/* 機能カード */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                体調分析
              </CardTitle>
              <CardDescription>過去のデータを分析</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                記録したデータから体調の傾向を確認できます。
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                天気連携
              </CardTitle>
              <CardDescription>環境データと連携</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                天気・気圧データと体調の相関を分析します。
              </p>
            </CardContent>
          </Card>
        </div> */}

        {/* 今後の機能予定 */}
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>今後の機能予定</CardTitle>
            <CardDescription>開発中の機能をご紹介します</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>花粉・PM2.5データの連携</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>体調予測機能</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>週次レポート機能</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>SNS共有機能</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
