"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ConcernTopic } from "@/lib/schemas/concern-topics";

export interface ConcernTopicCheckboxListProps {
  topics: ConcernTopic[];
  selectedKeys: Set<string>;
  onToggle: (key: string, checked: boolean) => void;
  disabled?: boolean;
  /** オンボーディング用のコンパクト表示 */
  compact?: boolean;
  /** 選択数を表示する（例: 3件選択中） */
  showSelectionCount?: boolean;
  /** スクロール可能な高さ（max-height）。オンボーディング等で使用 */
  maxHeight?: string;
}

export function ConcernTopicCheckboxList({
  topics,
  selectedKeys,
  onToggle,
  disabled = false,
  compact = false,
  showSelectionCount = false,
  maxHeight,
}: ConcernTopicCheckboxListProps) {
  const listContent = (
    <div className="space-y-2">
      {topics.map((topic) => {
        const isSelected = selectedKeys.has(topic.key);
        return (
          <label
            key={topic.key}
            className={cn(
              "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all min-h-[52px] sm:min-h-[56px]",
              "hover:bg-muted/50 active:bg-muted/70",
              "touch-manipulation",
              isSelected
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-border hover:border-muted-foreground/30",
              compact && "p-3 min-h-[48px] gap-3",
            )}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onToggle(topic.key, checked === true)
              }
              disabled={disabled}
              className="mt-0.5 shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-0.5">
              <p
                className={cn(
                  "font-medium text-foreground",
                  compact ? "text-sm" : "text-base",
                )}
              >
                {topic.label_ja}
              </p>
              {topic.description_ja && (
                <p
                  className={cn(
                    "text-muted-foreground leading-relaxed",
                    compact ? "text-xs" : "text-sm",
                  )}
                >
                  {topic.description_ja}
                </p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      {showSelectionCount && (
        <p className="text-sm text-muted-foreground">
          {selectedKeys.size}件選択中
        </p>
      )}
      <div
        className={cn(maxHeight && "overflow-y-auto")}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {listContent}
      </div>
    </div>
  );
}
