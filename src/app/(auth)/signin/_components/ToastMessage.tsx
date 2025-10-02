"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ToastMessage( message: string, description: string, duration: number ) {
  useEffect(() => {
    setTimeout(() => {
      toast.error(message, {
        description: description,
        duration: duration,
      });
    }, 100);
  }, [message, description, duration]);

  return null;
}
