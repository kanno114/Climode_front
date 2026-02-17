import { Loading } from "@/components/ui/loading";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <Loading size="lg" text="読み込み中..." className="min-h-[50vh]" />
    </div>
  );
}
