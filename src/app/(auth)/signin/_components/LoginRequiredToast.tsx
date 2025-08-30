"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function LoginRequiredToast() {
  useEffect(() => {
    setTimeout(() => {
      toast.error("ログインが必要です", {
        description: "このページにアクセスするには、アカウントにログインしてください。",
        duration: 5000,
      });
    }, 100);
  }, []);

  return null;
}

