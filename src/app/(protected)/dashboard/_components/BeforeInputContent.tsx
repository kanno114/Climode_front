"use client";

import { MorningDeclarationForm } from "../../morning/_components/MorningDeclarationForm";
import { Calendar } from "lucide-react";

export function BeforeInputContent() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5" />
          体調を入力してみましょう
        </div>
        <p className="text-sm text-muted-foreground">
          睡眠・気分・疲労感を数タップで記録し、今日の提案づくりに役立てます。
        </p>
        <div className="pt-2">
          <MorningDeclarationForm />
        </div>
      </div>
    </div>
  );
}
