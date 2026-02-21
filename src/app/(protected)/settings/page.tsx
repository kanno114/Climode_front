import { auth } from "@/auth";
import { AlertTriangle } from "lucide-react";
import { getProfileAction, getPrefectures } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsTabs } from "./_components/SettingsTabs";

export default async function SettingsPage() {
  const session = await auth();

  const [profile, prefectures] = await Promise.all([
    getProfileAction(),
    getPrefectures(),
  ]);

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center gap-3 py-6">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-gray-700 dark:text-gray-300">
                設定情報の取得に失敗しました。しばらくしてからもう一度お試しください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">設定</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            アカウント情報や通知などを管理できます
          </p>
        </div>

        <SettingsTabs
          user={session?.user ?? {}}
          profile={profile}
          prefectures={prefectures ?? []}
          isOAuthUser={
            !!session?.user?.image &&
            session.user.image.includes("googleusercontent.com")
          }
        />
      </div>
    </div>
  );
}
