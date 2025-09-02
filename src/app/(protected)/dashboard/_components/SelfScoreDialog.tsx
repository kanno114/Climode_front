import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Star } from "lucide-react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { updateSelfScoreAction } from "../actions";
import { useActionState } from "react";
import { selfScoreSchema } from "@/lib/schemas/self-score";
import { useState } from "react";

interface SelfScoreDialogProps {
  dailyLog: {
    id: number;
    score: number;
    self_score?: number;
  };
}

export function SelfScoreDialog({ dailyLog }: SelfScoreDialogProps) {
  const [score, setScore] = useState<number[]>([
    dailyLog.self_score || dailyLog.score,
  ]);

  const [lastResult, action, pending] = useActionState(
    updateSelfScoreAction,
    undefined
  );
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: selfScoreSchema,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4" />
          セルフスコア
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>スコアを入力</DialogTitle>
        </DialogHeader>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate
          className="space-y-6"
        >
          {/* セルフスコア */}
          <div className="space-y-2">
            <Label htmlFor="self_score">
              <Star className="inline mr-2 h-4 w-4" />
              セルフスコア（0〜100）
            </Label>
            <p className="text-xs text-muted-foreground">
              セルフスコアを入力してください。
            </p>
            <div className="space-y-4">
              <Slider
                value={score}
                onValueChange={setScore}
                min={0}
                max={100}
                step={1}
                disabled={pending}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-medium">{score[0]}スコア</span>
                <span>100</span>
              </div>
            </div>
            <input
              type="hidden"
              name={fields.self_score.name}
              value={score[0]}
            />
            {fields.self_score.errors?.map((e) => (
              <p key={e} className="text-sm text-red-500">
                {e}
              </p>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新中...
                </>
              ) : (
                "更新"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
