"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";
import {
  getConcernTopicsAction,
  getUserConcernTopicsAction,
  updateUserConcernTopicsAction,
} from "@/app/(protected)/concern-topics/actions";

type ConcernTopicsStepProps = {
  onComplete: () => void;
  onSkip: () => void;
};

export function ConcernTopicsStep({
  onComplete,
  onSkip,
}: ConcernTopicsStepProps) {
  const [topics, setTopics] = useState<ConcernTopic[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [topicsData, userKeys] = await Promise.all([
          getConcernTopicsAction(),
          getUserConcernTopicsAction(),
        ]);
        if (topicsData) {
          setTopics(topicsData);
        }
        if (userKeys) {
          setSelectedKeys(new Set(userKeys));
        }
      } catch (error) {
        console.error("関心ワード取得エラー:", error);
        toast.error("関心ワードの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
        toast.success("関心ワードを登録しました");
        onComplete();
      } else {
        toast.error(result.error?.message ?? "登録に失敗しました");
      }
    } catch (error) {
      toast.error("関心ワードの登録に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="rounded-lg border p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          登録できる関心ワードはありません
        </p>
        <Button className="w-full" onClick={onSkip}>
          次へ進む
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {topics.map((topic) => (
          <label
            key={topic.key}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selectedKeys.has(topic.key)}
              onCheckedChange={(checked) =>
                handleToggle(topic.key, checked === true)
              }
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {topic.label_ja}
              </p>
              {topic.description_ja && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {topic.description_ja}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

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
          toast.info("関心ワードはいつでも登録できます");
          onSkip();
        }}
        disabled={saving}
      >
        今はスキップ
      </Button>
    </div>
  );
}
