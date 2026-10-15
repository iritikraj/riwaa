/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardClient from "./_client";

export default async function GoogleDashboardPage({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = await params;

  // In a real scenario, you would fetch pending blueprints or optimization tasks from Strapi here
  // const pendingTasks = await fetchPendingGoogleTasks(resolvedParams.accountId);
  const pendingTasks: any[] = [];

  return <DashboardClient activeAccountId={resolvedParams.accountId} pendingTasks={pendingTasks} />;
}