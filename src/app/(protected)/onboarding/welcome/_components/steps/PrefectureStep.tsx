"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { updateOnboardingPrefecture } from "../../actions";

type PrefectureOption = {
  id: number;
  code: string;
  name_ja: string;
};

type PrefectureStepProps = {
  prefectures: PrefectureOption[];
  initialPrefectureId?: number | null;
  onComplete: () => void;
};

export function PrefectureStep({
  prefectures,
  initialPrefectureId,
  onComplete,
}: PrefectureStepProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState(
    initialPrefectureId ? String(initialPrefectureId) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleContinue = () => {
    if (!selectedPrefecture) {
      setError("都道府県を選択してください");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        if (
          !initialPrefectureId ||
          selectedPrefecture !== String(initialPrefectureId)
        ) {
          const result = await updateOnboardingPrefecture(
            Number(selectedPrefecture)
          );
          if (result.status === "error") {
            setError(result.error ?? "取得地域の保存に失敗しました");
            return;
          }
          toast.success("取得地域を保存しました");
        }
        onComplete();
      } catch (err) {
        console.error(err);
        setError("取得地域の保存に失敗しました");
      }
    });
  };

  if (!prefectures || prefectures.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        都道府県データの取得に失敗しました。お手数ですが時間をおいて再度お試しください。
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prefecture_id">取得地域（都道府県）</Label>
        <Select
          value={selectedPrefecture}
          onValueChange={(value) => {
            setSelectedPrefecture(value);
            setError(null);
          }}
          disabled={pending}
        >
          <SelectTrigger>
            <SelectValue placeholder="都道府県を選択してください" />
          </SelectTrigger>
          <SelectContent>
            {prefectures.map((prefecture) => (
              <SelectItem key={prefecture.id} value={prefecture.id.toString()}>
                {prefecture.name_ja}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          気象データは都道府県単位で取得されます。あとから設定でも変更できます。
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button
        className="w-full"
        onClick={handleContinue}
        disabled={!selectedPrefecture || pending}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          "保存して次へ進む"
        )}
      </Button>
    </div>
  );
}


