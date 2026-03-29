import { AdminDashboard } from "@/app/ui/dashboard/stats-cards";
import {
  DashboardChartsSkeleton,
  DashboardKpiCardsSkeleton,
  DashboardOperationalSkeleton,
} from "@/app/ui/dashboard/skeletons";

export default function LoadingDashboardPage() {
  return (
    <AdminDashboard>
      <DashboardKpiCardsSkeleton />
      <DashboardChartsSkeleton />
      <DashboardOperationalSkeleton />
    </AdminDashboard>
  );
}
