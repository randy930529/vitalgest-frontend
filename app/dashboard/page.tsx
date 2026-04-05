import { Metadata } from "next";
import { Suspense } from "react";
import { AdminDashboard } from "@/app/ui/dashboard/stats-cards";
import {
  DashboardChartsCards,
  DashboardKpiCards,
  DashboardOperationalCards,
} from "@/app/ui/dashboard/dashboard-cards-async";
import {
  DashboardChartsSkeleton,
  DashboardKpiCardsSkeleton,
  DashboardOperationalSkeleton,
} from "@/app/ui/dashboard/skeletons";

export const metadata: Metadata = {
  title: "Panel Administrativo",
};

export default function DashboardPage() {
  return (
    <AdminDashboard>
      <Suspense fallback={<DashboardKpiCardsSkeleton />}>
        <DashboardKpiCards />
      </Suspense>

      <Suspense fallback={<DashboardChartsSkeleton />}>
        <DashboardChartsCards />
      </Suspense>

      <Suspense fallback={<DashboardOperationalSkeleton />}>
        <DashboardOperationalCards />
      </Suspense>
    </AdminDashboard>
  );
}
