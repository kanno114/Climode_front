"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Menu,
  BarChart3,
  LogOut,
  Home,
  Settings,
  Heart,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function DashboardMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ルートが変わるたびにダイアログを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // チュートリアル中はメニュー項目を制限
  const isOnboarding = pathname.startsWith("/onboarding/welcome");

  const menuItems = isOnboarding
    ? []
    : [
        {
          icon: Home,
          label: "ダッシュボード",
          href: "/dashboard",
          description: "ホーム画面に戻る",
        },
        {
          icon: Calendar,
          label: "カレンダー",
          href: "/calendar",
          description: "記録をカレンダーで確認",
        },
        {
          icon: BarChart3,
          label: "週間レポート",
          href: "/reports/weekly",
          description: "週間サマリーと週次レポートを確認",
        },
        {
          icon: Heart,
          label: "関心ワード",
          href: "/concern-topics",
          description: "気になる体調・環境を登録",
        },
      ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Menu className="h-10 w-10" />
          メニュー
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">メニュー</DialogTitle>
        </DialogHeader>

        <Link href="/profile">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || "ユーザー"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        </Link>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        <LogoutButton>
          <div className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-red-600 dark:text-red-400 font-medium">
              ログアウト
            </div>
          </div>
        </LogoutButton>
      </DialogContent>
    </Dialog>
  );
}
