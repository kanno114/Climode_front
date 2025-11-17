import { auth } from "@/auth";
import { fetchUserTriggers, fetchTriggerPresets } from "@/lib/api/triggers";
import type { Trigger, UserTrigger } from "@/lib/schemas/triggers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TriggerSetupForm } from "./_components/TriggerSetupForm";

export default async function TriggerSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?message=login_required");
  }

  let userTriggers: UserTrigger[] = [];
  let presetTriggers: Trigger[] = [];

  try {
    const [ut, presets] = await Promise.all([
      fetchUserTriggers(session.user.id),
      fetchTriggerPresets(session.user.id),
    ]);
    userTriggers = ut;
    presetTriggers = presets;
  } catch (error) {
    console.error("ユーザートリガーの取得に失敗しました:", error);
  }

  const initialSelectedKeys = (userTriggers ?? []).map((u) => u.trigger.key);
  return (
    <div className="container mx-auto max-w-5xl space-y-10 px-4 py-10">
      <TriggerSetupForm
        triggers={presetTriggers}
        initialSelectedKeys={initialSelectedKeys}
      />
    </div>
  );
}
