import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Shield } from "lucide-react";

type AccountInfoProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function getAuthMethod(image?: string | null): string {
  if (image && image.includes("googleusercontent.com")) {
    return "Google アカウント";
  }
  return "メール・パスワード";
}

export function AccountInfo({ user }: AccountInfoProps) {
  const authMethod = getAuthMethod(user.image);

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 ring-2 ring-blue-200 dark:ring-blue-800">
        <AvatarImage src={user.image || ""} alt={`${user.name || "ユーザー"}のプロフィール画像`} />
        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-lg">
          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {user.name || "ユーザー"}
        </h3>
        {user.email && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500">
          <Shield className="h-3.5 w-3.5" />
          <span>{authMethod}</span>
        </div>
      </div>
    </div>
  );
}
