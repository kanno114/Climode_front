import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TriggerSetupAlertProps {
  hasNoUserTriggers: boolean;
}

export function TriggerSetupAlert({
  hasNoUserTriggers,
}: TriggerSetupAlertProps) {
  if (!hasNoUserTriggers) {
    return null;
  }

  return (
    <Alert className="border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">トリガーを設定しましょう</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <span>
          あなたが気になっている症状や環境条件を登録すると、シグナルの精度が高まります。
        </span>
        <Button asChild variant="secondary" size="sm">
          <Link href="/settings/triggers">トリガーを設定</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

