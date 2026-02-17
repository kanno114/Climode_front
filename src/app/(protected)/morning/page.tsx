import { MorningDeclarationForm } from "./_components/MorningDeclarationForm";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default async function MorningPage() {
  const today = new Date();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 挨拶と日付 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">おはようございます！</h1>
            <p className="text-lg text-muted-foreground">
              {format(today, "yyyy年MM月dd日", { locale: ja })}
            </p>
          </div>

          {/* フォーム */}
          <MorningDeclarationForm />
        </div>
      </div>
    </div>
  );
}

