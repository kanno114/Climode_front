"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/logout";

export default function LogoutButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const handleLogout = async () => {
    await logout();
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
