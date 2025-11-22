import { Metadata } from "next";
import {
  AdminDashboard,
  DashboardSections,
  DashboardStats,
} from "@/app/ui/dashboard/stats-cards";

export const metadata: Metadata = {
  title: "Panel Administrativo",
};

export default function DashboardPage() {
  // (Página) Resumen general del Dashboard - [SSR]

  return (
    <AdminDashboard>
      <>
        <DashboardStats />
        <DashboardSections />
      </>
    </AdminDashboard>
  );
}
