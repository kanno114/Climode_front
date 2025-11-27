"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Trigger } from "@/lib/schemas/triggers";
import { registerTriggerSelection } from "@/app/(protected)/settings/triggers/actions";

type TriggerStepProps = {
  triggerPresets: Trigger[];
  initialSelectedKeys: string[];
  onComplete: () => void;
  onSkip: () => void;
};

export function TriggerStep({
  triggerPresets,
  initialSelectedKeys,
  onComplete,
  onSkip,
}: TriggerStepProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    () => new Set(initialSelectedKeys)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      for (const key of selectedKeys) {
        formData.append("triggerKeys", key);
      }
      const result = await registerTriggerSelection(undefined, formData);
      if (result?.status === "error") {
        setError(result.errors.join("、"));
        return;
      }
      toast.success("トリガー設定を保存しました");
      onComplete();
    });
  };

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-1">
        {triggerPresets.map((trigger) => (
          <label
            key={trigger.id}
            className={`flex items-start gap-3 rounded-md border p-3 text-sm transition hover:border-primary/60 ${
              selectedKeys.has(trigger.key)
                ? "border-primary bg-primary/5"
                : "border-muted"
            }`}
          >
            <Checkbox
              checked={selectedKeys.has(trigger.key)}
              onCheckedChange={() => toggleKey(trigger.key)}
              className="mt-1"
              disabled={pending}
            />
            <div>
              <p className="font-medium text-base">{trigger.label}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {trigger.category === "env" ? "環境シグナル" : "身体シグナル"}
              </p>
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-col gap-3 md:flex-row">
        <Button
          type="button"
          className="flex-1"
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            "選択を保存"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => {
            toast.info("トリガー設定はあとから変更できます");
            onSkip();
          }}
          disabled={pending}
        >
          今はスキップ
        </Button>
      </div>
    </div>
  );
}


