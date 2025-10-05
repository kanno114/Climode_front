import { ProfileEditForm } from "./_components/ProfileEditForm";
import { getProfileAction } from "./actions";

export default async function ProfilePage() {
  const profile = await getProfileAction();

  // デバッグ用
  console.log("Profile data:", profile);

  // プロファイルが取得できない場合はログインページにリダイレクト
  if (!profile) {
    console.error("プロファイルデータが取得できませんでした");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">プロファイル</h1>
          <p className="text-gray-600 mt-2">あなたの基本情報を管理できます</p>
        </div>

        <ProfileEditForm
          initialData={{
            name: profile?.user?.name || "",
            prefecture_id: profile?.user?.prefecture_id,
          }}
        />
      </div>
    </div>
  );
}
