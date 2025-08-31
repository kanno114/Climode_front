"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="w-full h-auto p-0 hover:bg-transparent focus:bg-transparent cursor-pointer"
    >
      {children}
    </Button>
  );
}
