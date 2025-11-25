import { redirect } from "next/navigation";

interface WeeklyReportPageProps {
  searchParams: { start?: string };
}

export default async function WeeklyReportPage({
  searchParams,
}: WeeklyReportPageProps) {
  const weekStart = searchParams.start;
  const params = weekStart ? `?tab=report&start=${weekStart}` : "?tab=report";
  redirect(`/dashboard/weekly${params}`);
}

