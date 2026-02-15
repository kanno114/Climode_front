import DashboardMenu from "./DashboardMenu";
import { getProfileAction } from "../profile/actions";
import Link from "next/link";

export async function Header() {

  const user = await getProfileAction();
  if (!user) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Climode
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              体調の気づきをサポート
            </span>
          </Link>
          <DashboardMenu user={user.user} />
        </div>
      </div>
    </header>
  );
}