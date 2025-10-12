// 体調スコア共有ページ
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  searchParams: Promise<{
    score?: string;
    date?: string;
    message?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score || "0";
  const date = params.date || "";
  const message = params.message || "";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/api/og/score?score=${encodeURIComponent(
    score
  )}&date=${encodeURIComponent(date)}&message=${encodeURIComponent(message)}`;
  const pageUrl = `${baseUrl}/share/score?score=${score}&date=${encodeURIComponent(
    date
  )}&message=${encodeURIComponent(message)}`;

  return {
    title: `体調スコア: ${score}点 - Climode`,
    description: `${date} - ${message}`,
    openGraph: {
      title: `体調スコア: ${score}点`,
      description: `${date} - ${message}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `体調スコア ${score}点`,
        },
      ],
      type: "website",
      siteName: "Climode",
      url: pageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `体調スコア: ${score}点`,
      description: `${date} - ${message}`,
      images: ogImageUrl,
    },
  };
}

export default async function ShareScorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const score = params.score || "0";
  const date = params.date || "";
  const message = params.message || "";

  const scoreNum = parseInt(score, 10);
  let badgeClassName = "";

  if (scoreNum >= 80) {
    badgeClassName = "bg-green-500 hover:bg-green-600 text-white";
  } else if (scoreNum >= 60) {
    badgeClassName = "bg-blue-500 hover:bg-blue-600 text-white";
  } else if (scoreNum >= 40) {
    badgeClassName = "bg-yellow-500 hover:bg-yellow-600 text-white";
  } else {
    badgeClassName = "bg-red-500 hover:bg-red-600 text-white";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100">
            Climode
          </CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            体調管理アプリ
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 日付 */}
          <div className="text-center text-gray-600 dark:text-gray-400">
            {date}
          </div>

          {/* スコア表示 */}
          <div className="text-center space-y-4">
            <div className="text-xl text-blue-900 dark:text-blue-100">
              体調スコア
            </div>
            <div className="text-7xl font-bold text-blue-600 dark:text-blue-400">
              {score}
              <span className="text-3xl text-gray-600 dark:text-gray-400 ml-2">
                点
              </span>
            </div>

            {/* スコアバー */}
            <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-6 overflow-hidden">
              <div
                className="h-6 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 transition-all duration-500"
                style={{
                  width: `${Math.min(Math.max(scoreNum, 0), 100)}%`,
                }}
              />
            </div>

            {/* メッセージ */}
            <div>
              <Badge variant="default" className={badgeClassName}>
                {message}
              </Badge>
            </div>
          </div>

          {/* アプリへのリンク */}
          <div className="text-center space-y-4 pt-6 border-t">
            <p className="text-gray-600 dark:text-gray-400">
              あなたも体調管理を始めませんか？
            </p>
            <Link href="/signin">
              <Button size="lg" className="w-full sm:w-auto">
                Climodeを始める
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
