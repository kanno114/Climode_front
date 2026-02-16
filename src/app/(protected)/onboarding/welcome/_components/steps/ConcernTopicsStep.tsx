"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConcernTopicCheckboxList } from "@/app/(protected)/concern-topics/_components/ConcernTopicCheckboxList";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";
import { updateUserConcernTopicsAction } from "@/app/(protected)/concern-topics/actions";

type ConcernTopicsStepProps = {
  topics: ConcernTopic[];
  initialSelectedKeys: string[];
  onComplete: (count?: number) => void;
  onSkip: () => void;
};

export function ConcernTopicsStep({
  topics,
  initialSelectedKeys,
  onComplete,
  onSkip,
}: ConcernTopicsStepProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(initialSelectedKeys)
  );
  const [saving, setSaving] = useState(false);

  const handleToggle = (key: string, checked: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    try {
      const result = await updateUserConcernTopicsAction(
        Array.from(selectedKeys),
      );
      if (result.status === "success") {
        toast.success("関心トピックを登録しました");
        onComplete(selectedKeys.size);
      } else {
        toast.error(result.error?.message ?? "登録に失敗しました");
      }
    } catch {
      toast.error("関心トピックの登録に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (topics.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          登録できる関心トピックはありません
        </p>
        <Button className="w-full" onClick={onSkip}>
          次へ進む
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <ConcernTopicCheckboxList
        topics={topics}
        selectedKeys={selectedKeys}
        onToggle={handleToggle}
        disabled={saving}
        compact
        showSelectionCount
        maxHeight="300px"
      />

      <Button
        className="w-full"
        onClick={handleSaveAndContinue}
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          "保存して次へ進む"
        )}
      </Button>
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          toast.info("関心トピックはいつでも登録できます");
          onSkip();
        }}
        disabled={saving}
      >
        今はスキップ
      </Button>
    </div>
  );
}
