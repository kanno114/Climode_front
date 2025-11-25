import { redirect } from "next/navigation";

export default async function WeeklySummaryPage() {
  redirect("/dashboard/weekly?tab=summary");
}
