import {
  BuildingOffice2Icon,
  TruckIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  AmbulanceType,
  DelegationType,
  GuardType,
} from "@/app/lib/definitions";
import { ChartHeader } from "@/app/ui/dashboard/operations-charts";
import { AlertCard, SummaryCard } from "@/app/ui/cards";
import { Badge } from "@/app/ui/components/badges";

export async function AdminDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/80 p-4 backdrop-blur-sm sm:p-6">
      <div className="pointer-events-none absolute -top-16 right-0 h-44 w-44 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 left-4 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl" />
      {children}
    </main>
  );
}

export function DashboardSections({
  guards,
  delegations,
  ambulances,
  criticalUnitCount,
  topCriticalSupplies,
}: {
  guards: GuardType[];
  delegations: DelegationType[];
  ambulances: AmbulanceType[];
  criticalUnitCount: number;
  topCriticalSupplies: {
    supplyId: string;
    ambulanceId: string;
    ambulanceNumber: string;
    pharmacyId: string;
    category: string;
    deficit: number;
  }[];
}) {
  return (
    <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <GuardsStats
        guards={guards}
        ambulances={ambulances}
        criticalUnitCount={criticalUnitCount}
        topCriticalSupplies={topCriticalSupplies}
      />
      <DelegationStats
        guards={guards}
        delegations={delegations}
        ambulances={ambulances}
      />
    </section>
  );
}

export function GuardsStats({
  guards,
  ambulances,
  criticalUnitCount,
  topCriticalSupplies,
}: {
  guards: GuardType[];
  ambulances: AmbulanceType[];
  criticalUnitCount: number;
  topCriticalSupplies: {
    supplyId: string;
    ambulanceId: string;
    ambulanceNumber: string;
    pharmacyId: string;
    category: string;
    deficit: number;
  }[];
}) {
  const activeGuards = guards.filter(({ state }) => state === "En curso");

  const activeAmbulanceIds = new Set(
    activeGuards.flatMap((guard) =>
      (guard.shifts || [])
        .map((shift) => shift.ambulance?.id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const totalAmbulances = ambulances.length;
  const activeAmbulances = activeAmbulanceIds.size;
  const inactiveAmbulances = Math.max(totalAmbulances - activeAmbulances, 0);
  const maxDeficit = topCriticalSupplies.length
    ? Math.max(...topCriticalSupplies.map((item) => item.deficit))
    : 0;

  const nextTasks = [
    inactiveAmbulances
      ? `Asignar guardia a ${inactiveAmbulances} unidad(es) sin cobertura`
      : "Mantener cobertura actual en todas las unidades",
    criticalUnitCount
      ? `Atender insumos criticos en ${criticalUnitCount} unidad(es)`
      : "Sin unidades con insumos criticos",
  ];

  return (
    <article className="min-h-[520px] rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <ChartHeader
        title="Centro Operativo"
        subtitle="Prioridades activas y siguientes acciones."
        badge={{ text: "Actualizado hace 2 min", type: "default" }}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          key="risk-units"
          title={String(criticalUnitCount)}
          subtitle="Unidades con riesgo"
          summaryType="danger"
          summaryIcon={ExclamationTriangleIcon}
        />
        <SummaryCard
          key="inactive-ambulances"
          title={String(inactiveAmbulances)}
          subtitle="Unidades sin guardia"
          summaryType="warning"
          summaryIcon={CalendarIcon}
        />
        <SummaryCard
          key="max-deficit"
          title={String(maxDeficit)}
          subtitle="Deficit maximo"
          summaryType="success"
          summaryIcon={TruckIcon}
        />
      </div>

      <section className="space-y-3" aria-label="Requiere atencion">
        <ChartHeader title="Requiere atencion" />
        <AlertCard
          title="Insumos críticos en unidades operativas"
          subtitle={
            <>
              <CalendarIcon className="h-3 w-3" />
              <span>
                {criticalUnitCount} unidad(es) con insumos por debajo del minimo
              </span>
            </>
          }
          alertType="danger"
          alertIcon={ExclamationTriangleIcon}
          badge={{ text: "Critica", type: "danger" }}
        />

        <AlertCard
          title="Cobertura operativa comprometida"
          subtitle={
            <>
              <CalendarIcon className="h-3 w-3" />
              <span>{inactiveAmbulances} unidad(es) sin guardia activa</span>
            </>
          }
          alertType="warning"
          alertIcon={CalendarIcon}
          badge={{ text: "Media", type: "warning" }}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-900">
          Top 3 insumos críticos
        </h3>
        {topCriticalSupplies.length ? (
          <ul className="mt-3 space-y-2">
            {topCriticalSupplies.map((item, index) => (
              <li
                key={`${item.ambulanceId}-${item.category}-${index}`}
                className="rounded-xl border border-slate-200 bg-white transition hover:border-rose-200 hover:bg-rose-50/40"
              >
                <Link
                  href={`/dashboard/supplies/ambulances?ambulance=${item.ambulanceId}&pharmacy=${item.pharmacyId}&supply=${item.supplyId}`}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-700">
                      {item.category} - Unidad {item.ambulanceNumber}
                    </p>
                  </div>
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    {item.deficit}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm font-medium text-emerald-700">
            No hay insumos críticos registrados.
          </p>
        )}
      </section>
    </article>
  );
}

export function DelegationStats({
  guards,
  delegations,
  ambulances,
}: {
  guards: GuardType[];
  delegations: DelegationType[];
  ambulances: AmbulanceType[];
}) {
  const activeGuards = guards.filter(({ state }) => state === "En curso");
  const activeAmbulanceIds = new Set(
    activeGuards.flatMap((guard) =>
      (guard.shifts || [])
        .map((shift) => shift.ambulance?.id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const delegationSummaries = delegations
    .map((delegation) => {
      const delegationAmbulances = ambulances.filter(
        (ambulance) => ambulance.delegation?.id === delegation.id,
      );
      const available = delegationAmbulances.filter((ambulance) =>
        activeAmbulanceIds.has(ambulance.id),
      ).length;
      const total = delegationAmbulances.length;
      const pending = Math.max(total - available, 0);
      const coverage = total ? Math.round((available / total) * 100) : 0;

      return {
        delegation,
        available,
        total,
        pending,
        coverage,
      };
    })
    .sort((a, b) => b.coverage - a.coverage);

  const activeDelegations = delegationSummaries.filter(
    ({ total }) => total > 0,
  );
  const totalAvailable = delegationSummaries.reduce(
    (sum, item) => sum + item.available,
    0,
  );
  const totalPending = delegationSummaries.reduce(
    (sum, item) => sum + item.pending,
    0,
  );
  const globalCoverage = ambulances.length
    ? Math.round((totalAvailable / ambulances.length) * 100)
    : 0;

  const topDelegations = delegationSummaries.slice(0, 2);

  return (
    <article className="min-h-[520px] rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <ChartHeader
        title="Estado por Delegacion"
        subtitle="Cobertura, disponibilidad y riesgo operativo."
        badge={{ text: `${globalCoverage}% cobertura global`, type: "success" }}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          key="active-delegations"
          title={String(activeDelegations.length)}
          subtitle="Delegaciones activas"
          summaryType="default"
          summaryIcon={BuildingOffice2Icon}
        />
        <SummaryCard
          key="available-ambulances"
          title={String(totalAvailable)}
          subtitle="Ambulancias operativas"
          summaryType="danger"
          summaryIcon={TruckIcon}
        />
        <SummaryCard
          key="pending-ambulances"
          title={String(totalPending)}
          subtitle="Unidades pendientes"
          summaryType="warning"
          summaryIcon={ExclamationTriangleIcon}
        />
      </div>
      <div className="space-y-3">
        {topDelegations.length ? (
          topDelegations.map(
            ({ delegation, coverage, available, pending, total }) => {
              const statusLabel = coverage >= 80 ? "Estable" : "Seguimiento";
              const statusClass = coverage >= 80 ? "success" : "warning";

              return (
                <div
                  key={delegation.id}
                  className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {delegation.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{delegation.state?.name || "Sin estado"}</span>
                      </div>
                    </div>
                    <Badge title={statusLabel} variant={statusClass} />
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        Cobertura de unidad
                      </span>
                      <span className="font-semibold text-slate-800">
                        {coverage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-sky-100">
                      <div
                        className="h-2 rounded-full bg-sky-600"
                        style={{ width: `${coverage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Disponibilidad
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-800">
                        {available} de {total}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Pendientes
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-800">
                        {pending}
                      </p>
                    </div>
                  </div>
                </div>
              );
            },
          )
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-600">
            Sin datos de delegaciones disponibles.
          </div>
        )}
      </div>
    </article>
  );
}
