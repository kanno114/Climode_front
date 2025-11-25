import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { TodayArea } from "./_components/TodayArea";
import { getTodayDailyLog, getSuggestions, getTodaySignals } from "./actions";
import { auth } from "@/auth";
import { fetchUserTriggers } from "@/lib/api/triggers";
import { MorningDeclarationForm } from "../morning/_components/MorningDeclarationForm";
import { SignalsList } from "./_components/SignalsList";
import { TimeBasedContent } from "./_components/TimeBasedContent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
  const todayDailyLog = await getTodayDailyLog();
  const suggestions = await getSuggestions();
  const envSignals = await getTodaySignals("env");
  const bodySignals = await getTodaySignals("body");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {hasNoUserTriggers && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>トリガーが未設定です</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>
                通知や提案の精度向上のため、あなたの「トリガー」を設定してください。
              </span>
              <Button asChild>
                <Link href="/settings/triggers">トリガーを設定する</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* 時間帯に応じて表示が変わるコンポーネント（一番上に配置） */}
        <TimeBasedContent dailyLog={todayDailyLog} />

        {/* 1. 環境シグナル表示（体調入力前でも表示） */}
        {!todayDailyLog && (
          <div className="mb-6">
            <SignalsList
              signals={Array.isArray(envSignals) ? envSignals : []}
              hasError={envSignals === null}
              title="今日はこんな日になりそうです"
              emptyTitle="今日はこんな日になりそうです"
              emptyMessage="今日は環境の大きな変化は少なそうです ☀️"
              emptySubMessage="穏やかな一日になりそうです。"
            />
          </div>
        )}

        {/* 2. 体調入力フォーム */}
        {!todayDailyLog && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                体調を入力してみましょう
              </CardTitle>
              <CardDescription>
                睡眠時間・気分・疲労感を素早く入力してシグナル判定に活用します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MorningDeclarationForm />
            </CardContent>
          </Card>
        )}

        {/* 3. 体調入力後の表示（体調シグナルと提案） */}
        {todayDailyLog && (
          <TodayArea
            dailyLog={todayDailyLog}
            suggestions={suggestions}
            bodySignals={bodySignals}
            envSignals={envSignals}
          />
        )}

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
