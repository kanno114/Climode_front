"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface ToastMessageProps {
  message: string;
  description: string;
  duration: number;
}

export function ToastMessage({ message, description, duration }: ToastMessageProps) {
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
