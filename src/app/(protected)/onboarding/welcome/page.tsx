"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchTriggerPresets, fetchUserTriggers } from "@/lib/api/triggers";
import {
  getProfileAction,
  getPrefectures,
} from "@/app/(protected)/profile/actions";
import { OnboardingWizard } from "./_components/OnboardingWizard";
import type { Trigger, UserTrigger } from "@/lib/schemas/triggers";

type PrefectureOption = {
  id: number;
  code: string;
  name_ja: string;
};

export default async function OnboardingWelcomePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?message=login_required");
  }

  const prefectureList = (await getPrefectures()) ?? [];
  const prefectures: PrefectureOption[] = prefectureList;
  let triggerPresets: Trigger[] = [];
  let userTriggers: UserTrigger[] = [];

  try {
    const [presets, triggers] = await Promise.all([
      fetchTriggerPresets(session.user.id),
      fetchUserTriggers(session.user.id),
    ]);
    triggerPresets = presets;
    userTriggers = triggers;
  } catch (error) {
    console.error("Failed to load onboarding data:", error);
  }

  let profile = null;
  try {
    profile = await getProfileAction();
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
  const initialPrefectureId = profile?.user?.prefecture_id ?? null;
  const initialTriggerKeys = (userTriggers ?? []).map(
    (item) => item.trigger.key
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <OnboardingWizard
          prefectures={prefectures}
          initialPrefectureId={initialPrefectureId}
          triggerPresets={triggerPresets}
          initialSelectedTriggerKeys={initialTriggerKeys}
        />
      </div>
    </div>
  );
}
