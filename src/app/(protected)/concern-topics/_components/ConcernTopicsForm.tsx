"use client";

import { useState, useEffect } from "react";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";
import {
  getConcernTopicsAction,
  getUserConcernTopicsAction,
  updateUserConcernTopicsAction,
} from "../actions";
import { ConcernTopicCheckboxList } from "./ConcernTopicCheckboxList";

export function ConcernTopicsForm() {
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
      } catch {
        toast.error("関心トピックの取得に失敗しました");
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateUserConcernTopicsAction(
        Array.from(selectedKeys),
      );
      if (result.status === "success") {
        toast.success("関心トピックを更新しました");
      } else {
        toast.error(result.error?.message ?? "更新に失敗しました");
      }
    } catch {
      toast.error("関心トピックの更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            関心トピック
          </CardTitle>
          <CardDescription>
            登録できる関心トピックはありません
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          気になることを選ぶ
        </CardTitle>
        <CardDescription>
          選んだ項目に合わせて、よりあなたに合った提案をお届けします
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConcernTopicCheckboxList
          topics={topics}
          selectedKeys={selectedKeys}
          onToggle={handleToggle}
          disabled={saving}
          showSelectionCount
        />

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "保存する"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
