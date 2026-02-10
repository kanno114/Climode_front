import { ConcernTopicsForm } from "./_components/ConcernTopicsForm";

export default function ConcernTopicsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            関心ワード
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            気になる体調・環境を登録すると、よりあなたに合った提案を受け取れます
          </p>
        </div>

        <ConcernTopicsForm />
      </div>
    </div>
  );
}
