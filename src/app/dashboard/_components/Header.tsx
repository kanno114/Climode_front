import { DashboardMenu } from "./DashboardMenu";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Climode
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              体調管理ダッシュボード
            </p>
          </div>
          <div className="flex items-center gap-6 p-4">
            <DashboardMenu />
          </div>
        </div>
      </div>
    </header>
  );
}