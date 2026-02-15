import { Loading } from "@/components/ui/loading";

export default function AboutLoading() {
  return (
    <div className="container max-w-3xl py-8">
      <Loading size="lg" text="読み込み中..." className="min-h-[50vh]" />
    </div>
  );
}
