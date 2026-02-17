import { auth } from "@/auth";
import { AlertTriangle } from "lucide-react";
import { ProfileEditForm } from "./_components/ProfileEditForm";
import { AccountInfo } from "./_components/AccountInfo";
import { AccountDeleteSection } from "./_components/AccountDeleteSection";
import { getProfileAction, getPrefectures } from "./actions";
import { NotificationSettings } from "@/components/NotificationSettings";
import { CookieSettings } from "./_components/CookieSettings";
import { Card, CardContent } from "@/components/ui/card";
import LogoutButton from "../_components/LogoutButton";
import { LogOut } from "lucide-react";

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

        <div className="space-y-8">
          {/* セクション A: アカウント情報 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              アカウント情報
            </h2>
            <div className="space-y-4">
              <AccountInfo user={session?.user ?? {}} />
              <ProfileEditForm
                initialData={{
                  name: profile?.user?.name || "",
                  prefecture_id: profile?.user?.prefecture_id,
                }}
                prefectures={prefectures ?? []}
              />
            </div>
          </section>

          {/* セクション B: 通知設定 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              通知設定
            </h2>
            <NotificationSettings />
          </section>

          {/* セクション B2: Cookie設定 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cookie設定
            </h2>
            <CookieSettings />
          </section>

          {/* セクション C: アカウント管理 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              アカウント管理
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="py-4">
                  <LogoutButton>
                    <div className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50">
                        <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ログアウト
                      </span>
                    </div>
                  </LogoutButton>
                </CardContent>
              </Card>
              <AccountDeleteSection
                isOAuthUser={
                  !!session?.user?.image &&
                  session.user.image.includes("googleusercontent.com")
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
