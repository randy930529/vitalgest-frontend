import { Metadata } from "next";
import AdminDashboard from "@/app/ui/dashboard/stats-cards";

export const metadata: Metadata = {
  title: "Panel Administrativo",
};

export default function DashboardPage() {
  return (
    <>
      <p>(Página) Resumen general del Dashboard - [SSR]</p>
      <AdminDashboard />
    </>
  );
}
