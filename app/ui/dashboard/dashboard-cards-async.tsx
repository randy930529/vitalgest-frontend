import {
  UsersIcon,
  BuildingOffice2Icon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { cache } from "react";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchUsers } from "@/app/lib/data/users";
import { fetchGuards } from "@/app/lib/data/guards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchSuppliesByAmbulanceId } from "@/app/lib/data/supplies";
import { buildChartDataByRange } from "@/app/lib/dashboard-analytics";
import { DASHBOARD_KPI_COPY } from "@/app/lib/config/dashboardCopy";
import { StatCard } from "@/app/ui/dashboard/cards";
import OperationsCharts from "@/app/ui/dashboard/operations-charts";
import { DashboardSections } from "@/app/ui/dashboard/stats-cards";

const getDashboardCoreData = cache(async () => {
  const [users, delegations, ambulances, guards] = await Promise.all([
    fetchUsers().then((result) => result.data),
    fetchDelegations().then((result) => result.data),
    fetchAmbulances().then((result) => result.data),
    fetchGuards().then((result) => result.data),
  ]);

  return { users, delegations, ambulances, guards };
});

const getDashboardSuppliesData = cache(async () => {
  const { ambulances } = await getDashboardCoreData();

  const ambulanceSupplies = await Promise.all(
    ambulances.map(async (ambulance) => {
      const { data: supplies } = await fetchSuppliesByAmbulanceId(ambulance.id);
      return { ambulance, supplies };
    }),
  );

  const criticalSupplies = ambulanceSupplies.flatMap(
    ({ ambulance, supplies }) =>
      supplies
        .filter((supply) => supply.avaible_quantity <= supply.min_quantity)
        .map((supply) => ({
          supplyId: supply.id,
          ambulanceId: ambulance.id,
          ambulanceNumber: ambulance.number,
          pharmacyId: ambulance.delegation?.pharmacy?.id || "",
          category: supply.category,
          deficit: supply.min_quantity - supply.avaible_quantity,
        })),
  );

  const criticalUnitCount = new Set(
    criticalSupplies.map((critical) => critical.ambulanceId),
  ).size;

  const topCriticalSupplies = [...criticalSupplies]
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 3);

  return {
    criticalSupplies,
    criticalUnitCount,
    topCriticalSupplies,
  };
});

export async function DashboardKpiCards() {
  const { users, delegations, ambulances, guards } =
    await getDashboardCoreData();

  const totalGuardsActive = guards.filter(
    ({ state }) => state === "En curso",
  ).length;

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={DASHBOARD_KPI_COPY.totalUsers}
        value={users.length}
        icon={UsersIcon}
        color="bg-slate-800"
      />
      <StatCard
        title={DASHBOARD_KPI_COPY.delegations}
        value={delegations.length}
        icon={BuildingOffice2Icon}
        color="bg-emerald-600"
      />
      <StatCard
        title={DASHBOARD_KPI_COPY.ambulances}
        value={ambulances.length}
        icon={TruckIcon}
        color="bg-rose-500"
      />
      <StatCard
        title={DASHBOARD_KPI_COPY.activeGuards}
        value={totalGuardsActive}
        icon={ShieldCheckIcon}
        color="bg-sky-600"
      />
    </section>
  );
}

export async function DashboardChartsCards() {
  const [{ guards, ambulances, delegations }, { criticalSupplies }] =
    await Promise.all([getDashboardCoreData(), getDashboardSuppliesData()]);

  const pendingGuards = guards.filter(({ state }) => state === "Nueva").length;
  const activeGuards = guards.filter(
    ({ state }) => state === "En curso",
  ).length;

  const { trendDataByRange, delegationDataByRange } = buildChartDataByRange({
    guards,
    ambulances,
    delegations,
  });

  return (
    <OperationsCharts
      trendDataByRange={trendDataByRange}
      delegationDataByRange={delegationDataByRange}
      activeGuards={activeGuards}
      pendingGuards={pendingGuards}
      criticalSupplyCount={criticalSupplies.length}
    />
  );
}

export async function DashboardOperationalCards() {
  const [
    { guards, delegations, ambulances },
    { criticalUnitCount, topCriticalSupplies },
  ] = await Promise.all([getDashboardCoreData(), getDashboardSuppliesData()]);

  return (
    <DashboardSections
      guards={guards}
      delegations={delegations}
      ambulances={ambulances}
      criticalUnitCount={criticalUnitCount}
      topCriticalSupplies={topCriticalSupplies}
    />
  );
}
