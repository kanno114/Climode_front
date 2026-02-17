"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, MapPin } from "lucide-react";
import { profileSchema } from "@/lib/schemas/profile";
import { updateProfileAction } from "../actions";
import { useFormToast } from "@/hooks/use-form-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Prefecture = {
  id: number;
  code: string;
  name_ja: string;
};

interface ProfileEditFormProps {
  initialData: {
    name: string;
    prefecture_id?: number;
  };
  prefectures: Prefecture[];
}

export function ProfileEditForm({ initialData, prefectures }: ProfileEditFormProps) {
  const [lastResult, action, pending] = useActionState(
    updateProfileAction,
    undefined
  );
  useFormToast(lastResult, {
    errorFallback: "プロファイルの更新に失敗しました。",
    successMessage: "プロファイルを更新しました。",
  });

  const [form, fields] = useForm({
    id: "profile-edit-form",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: profileSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      name: initialData.name,
      prefecture_id: initialData.prefecture_id?.toString() || "",
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          className="space-y-6"
          aria-label="プロフィール編集"
        >
          {form.errors && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.errors.map((error) => (
                  <div key={error}>{error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* ニックネーム */}
          <div className="space-y-2">
            <Label htmlFor={fields.name.id} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              ニックネーム
            </Label>
            <Input
              id={fields.name.id}
              name={fields.name.name}
              type="text"
              placeholder="ニックネームを入力してください"
              defaultValue={fields.name.initialValue}
              className={fields.name.errors ? "border-red-500" : ""}
            />
            {fields.name.errors && (
              <p className="text-sm text-red-500">{fields.name.errors[0]}</p>
            )}
          </div>

          {/* 都道府県 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              都道府県
            </Label>
            <Select
              name={fields.prefecture_id.name}
              defaultValue={fields.prefecture_id.initialValue}
            >
              <SelectTrigger
                className={fields.prefecture_id.errors ? "border-red-500" : ""}
              >
                <SelectValue placeholder="都道府県を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {prefectures.map((prefecture) => (
                  <SelectItem
                    key={prefecture.id}
                    value={prefecture.id.toString()}
                  >
                    {prefecture.name_ja}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fields.prefecture_id.errors && (
              <p className="text-sm text-red-500">
                {fields.prefecture_id.errors[0]}
              </p>
            )}
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              更新する
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
