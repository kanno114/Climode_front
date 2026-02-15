import { ProfileEditForm } from "./_components/ProfileEditForm";
import { getProfileAction, getPrefectures } from "./actions";
import { NotificationSettings } from "@/components/NotificationSettings";

export default async function ProfilePage() {
  const [profile, prefectures] = await Promise.all([
    getProfileAction(),
    getPrefectures(),
  ]);

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">プロファイル</h1>
          <p className="text-gray-600 mt-2">あなたの基本情報を管理できます</p>
        </div>

        <div className="space-y-6">
          <ProfileEditForm
            initialData={{
              name: profile?.user?.name || "",
              prefecture_id: profile?.user?.prefecture_id,
            }}
            prefectures={prefectures ?? []}
          />

          <NotificationSettings />
        </div>
      </div>
    </div>
  );
}
