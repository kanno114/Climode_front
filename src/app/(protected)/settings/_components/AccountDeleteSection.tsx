"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteAccountAction } from "../actions";

type Props = {
  isOAuthUser: boolean;
};

export function AccountDeleteSection({ isOAuthUser }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSubmit = isOAuthUser ? confirmText === "削除" : password.length > 0;

  const handleDelete = () => {
    setError("");
    startTransition(async () => {
      const result = await deleteAccountAction(
        isOAuthUser ? { confirm: true } : { password },
      );
      if (!result.success) {
        setError(result.error || "アカウントの削除に失敗しました");
      }
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setPassword("");
      setConfirmText("");
      setError("");
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-800/50">
      <CardContent className="py-4">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-red-600 dark:text-red-400 font-medium">
                アカウントを削除する
              </span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                アカウント削除の確認
              </DialogTitle>
              <DialogDescription>
                すべてのデータが完全に削除されます。この操作は取り消せません。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {isOAuthUser ? (
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-text"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    確認のため「削除」と入力してください
                  </label>
                  <Input
                    id="confirm-text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="削除"
                    disabled={isPending}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    確認のためパスワードを入力してください
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    disabled={isPending}
                  />
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!canSubmit || isPending}
              >
                {isPending ? "削除中..." : "アカウントを削除する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
