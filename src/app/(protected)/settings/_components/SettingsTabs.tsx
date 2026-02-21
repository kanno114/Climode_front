"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { AccountInfo } from "./AccountInfo";
import { ProfileEditForm } from "./ProfileEditForm";
import { AccountDeleteSection } from "./AccountDeleteSection";
import { CookieSettings } from "./CookieSettings";
import { NotificationSettings } from "@/components/NotificationSettings";
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoutButton from "../../_components/LogoutButton";
import { LogOut } from "lucide-react";

type Prefecture = {
  id: number;
  code: string;
  name_ja: string;
};

type SettingsTabsProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  profile: {
    user: {
      name: string;
      prefecture_id?: number;
    };
  };
  prefectures: Prefecture[];
  isOAuthUser: boolean;
};

export function SettingsTabs({
  user,
  profile,
  prefectures,
  isOAuthUser,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile">
      <TabsList className="w-full">
        <TabsTrigger value="profile">プロフィール</TabsTrigger>
        <TabsTrigger value="general">一般</TabsTrigger>
        <TabsTrigger value="account">アカウント</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardContent className="space-y-6">
            <AccountInfo user={user} />
            <Separator />
            <ProfileEditForm
              initialData={{
                name: profile.user.name || "",
                prefecture_id: profile.user.prefecture_id,
              }}
              prefectures={prefectures}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="general">
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  テーマ
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  アプリの外観を切り替えます
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Separator />
            <NotificationSettings />
            <Separator />
            <CookieSettings />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardContent className="space-y-6">
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
            <Separator />
            <AccountDeleteSection isOAuthUser={isOAuthUser} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
