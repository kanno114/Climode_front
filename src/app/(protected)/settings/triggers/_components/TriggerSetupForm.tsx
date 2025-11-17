"use client";

import { useActionState, useEffect, useMemo, useState, type JSX } from "react";
import { registerTriggerSelection } from "../actions";
import type { Trigger } from "@/lib/schemas/triggers";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldAlert, ThermometerSun } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type TriggerSetupState =
  | {
      status: "error";
      errors: string[];
    }
  | {
      status: "idle";
    }
  | undefined;

type Props = {
  triggers: Trigger[];
  initialSelectedKeys: string[];
};

const CATEGORY_LABELS: Record<
  Trigger["category"],
  { label: string; icon: JSX.Element }
> = {
  env: {
    label: "環境要因",
    icon: <ThermometerSun className="h-4 w-4 text-sky-500" />,
  },
  body: {
    label: "身体要因",
    icon: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  },
};

export function TriggerSetupForm({ triggers, initialSelectedKeys }: Props) {
  const [state, action, pending] = useActionState<TriggerSetupState, FormData>(
    registerTriggerSelection,
    { status: "idle" }
  );
  const [selectedKeys, setSelectedKeys] = useState(
    () => new Set(initialSelectedKeys)
  );

  // サーバー側の再描画で props が更新された場合、ローカル state を同期
  useEffect(() => {
    setSelectedKeys(new Set(initialSelectedKeys));
  }, [initialSelectedKeys]);

  const groupedTriggers = useMemo(() => {
    return triggers.reduce<Record<Trigger["category"], Trigger[]>>(
      (acc, trigger) => {
        acc[trigger.category] = acc[trigger.category] || [];
        acc[trigger.category]!.push(trigger);
        return acc;
      },
      { env: [], body: [] }
    );
  }, [triggers]);

  const handleToggle = (triggerKey: string, checked: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(triggerKey);
      } else {
        next.delete(triggerKey);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedKeys(new Set(triggers.map((trigger) => trigger.key)));
  };

  const handleClear = () => {
    setSelectedKeys(new Set());
  };

  return (
    <form action={action} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            気になるトリガーを選択
          </h1>
          <p className="text-muted-foreground mt-2">
            当てはまる要因を選ぶと、状況に応じて通知やアドバイスを受け取れます。
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSelectAll}
            disabled={pending}
          >
            すべて選択
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={pending}
          >
            クリア
          </Button>
        </div>
      </div>

      {state?.status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>登録に失敗しました</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {state.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <section className="space-y-10">
        {(
          Object.entries(groupedTriggers) as Array<
            [Trigger["category"], Trigger[]]
          >
        ).map(([category, items]) => {
          if (items.length === 0) {
            return null;
          }

          const categoryMeta = CATEGORY_LABELS[category];

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                {categoryMeta.icon}
                <h2 className="text-xl font-semibold">{categoryMeta.label}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((trigger) => {
                  const isSelected = selectedKeys.has(trigger.key);
                  return (
                    <Card
                      key={trigger.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                          target.closest("input,[role='checkbox'],button,label")
                        )
                          return;
                        handleToggle(trigger.key, !isSelected);
                      }}
                      onKeyDown={(e) => {
                        // Enterのみカードとしてトグル（SpaceはCheckboxに任せる）
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleToggle(trigger.key, !isSelected);
                        }
                      }}
                      className={`cursor-pointer transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isSelected
                          ? "border-primary shadow-lg shadow-primary/10"
                          : "hover:shadow-md"
                      }`}
                    >
                      <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div>
                          <CardTitle className="text-lg">
                            {trigger.label}
                          </CardTitle>
                          {/* <CardDescription className="mt-1">
                            {trigger.rule?.levels?.[0]?.label
                              ? `例: ${trigger.rule.levels[0].label}`
                              : "通知レベルが設定されています"}
                          </CardDescription> */}
                        </div>
                        <Checkbox
                          id={`trigger-${trigger.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleToggle(trigger.key, checked === true)
                          }
                          // カードのクリックと二重発火しないようにする
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          disabled={pending}
                          className="mt-1"
                        />
                      </CardHeader>
                      {/* <CardContent className="space-y-3">
                        {trigger.rule?.levels &&
                          trigger.rule.levels.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                レベルと基準値
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {trigger.rule.levels.map((level) => (
                                  <Badge key={level.id} variant="secondary">
                                    {level.label} / {level.threshold}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        <p className="text-xs text-muted-foreground">
                          バージョン: v{trigger.version}
                        </p>
                      </CardContent> */}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {Array.from(selectedKeys).map((key) => (
        <input key={key} type="hidden" name="triggerKeys" value={key} />
      ))}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          選択したトリガーはいつでも「設定」ページから編集できます。
        </p>
        <Button type="submit" className="w-full md:w-auto" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登録中...
            </>
          ) : (
            "登録して続行"
          )}
        </Button>
      </div>
    </form>
  );
}
