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
  Heart,
  Settings,
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

const menuItemConfigs = [
  {
    icon: Home,
    label: "ダッシュボード",
    href: "/dashboard",
    description: "ホーム画面に戻る",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-50 dark:bg-blue-950/30",
    activeBorder: "border-l-blue-500",
    hoverIconBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60",
  },
  {
    icon: Calendar,
    label: "カレンダー",
    href: "/calendar",
    description: "記録をカレンダーで確認",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/30",
    activeBorder: "border-l-emerald-500",
    hoverIconBg:
      "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60",
  },
  {
    icon: BarChart3,
    label: "週間レポート",
    href: "/reports/weekly",
    description: "週間サマリーと週次レポートを確認",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    activeBg: "bg-violet-50 dark:bg-violet-950/30",
    activeBorder: "border-l-violet-500",
    hoverIconBg:
      "group-hover:bg-violet-200 dark:group-hover:bg-violet-800/60",
  },
  {
    icon: Heart,
    label: "関心トピック",
    href: "/concern-topics",
    description: "気になる体調・環境を登録",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    activeBg: "bg-rose-50 dark:bg-rose-950/30",
    activeBorder: "border-l-rose-500",
    hoverIconBg: "group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60",
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(href);
}

export default function DashboardMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ルートが変わるたびにダイアログを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // チュートリアル中はメニュー項目を制限
  const isOnboarding = pathname.startsWith("/onboarding/welcome");
  const menuItems = isOnboarding ? [] : menuItemConfigs;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold">メニュー</DialogTitle>
        </DialogHeader>

        <Link href="/settings">
          <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl mb-4 hover:shadow-md transition-shadow">
            <Avatar className="h-12 w-12 ring-2 ring-blue-200 dark:ring-blue-800">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || "ユーザー"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" />
          </div>
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-3 transition-all duration-150 cursor-pointer group ${
                    active
                      ? `${item.activeBg} ${item.activeBorder}`
                      : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${item.iconBg} ${item.hoverIconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-gray-900 dark:text-gray-100 ${active ? "font-semibold" : "font-medium"}`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-3" />

        <LogoutButton>
          <div className="flex items-center gap-3 w-full p-3 rounded-lg border-l-3 border-l-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50">
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
