"use client";

import { SignalsList } from "./SignalsList";
import { MorningDeclarationForm } from "../../morning/_components/MorningDeclarationForm";
import { Calendar } from "lucide-react";

type SignalEvent = {
  id: number;
  trigger_key: string;
  trigger_key_label?: string;
  category: string;
  level: string;
  priority: number;
  evaluated_at: string;
  meta?: Record<string, unknown> | null;
};

interface BeforeInputContentProps {
  envSignals: Array<SignalEvent> | null;
}

export function BeforeInputContent({ envSignals }: BeforeInputContentProps) {
  const normalizedEnvSignals = Array.isArray(envSignals) ? envSignals : [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SignalsList
        signals={normalizedEnvSignals}
        hasError={envSignals === null}
        title="今日はこんな日になりそうです"
        emptyTitle="今日はこんな日になりそうです"
        emptyMessage="今日は環境の大きな変化は少なそうです ☀️"
        emptySubMessage="穏やかな一日になりそうです。"
      />
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5" />
          体調を入力してみましょう
        </div>
        <p className="text-sm text-muted-foreground">
          睡眠・気分・疲労感を数タップで記録し、今日のシグナルづくりに役立てます。
        </p>
        <div className="pt-2">
          <MorningDeclarationForm />
        </div>
      </div>
    </div>
  );
}
