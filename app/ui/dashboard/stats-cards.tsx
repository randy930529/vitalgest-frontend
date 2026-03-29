import {
  BuildingOffice2Icon,
  TruckIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { fetchDelegations } from "@/app/lib/data";
import { fetchGuards } from "@/app/lib/data/guards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { DASHBOARD_SECTIONS_COPY } from "@/app/lib/config/dashboard-copy";

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
  guards: Awaited<ReturnType<typeof fetchGuards>>;
  delegations: Awaited<ReturnType<typeof fetchDelegations>>;
  ambulances: Awaited<ReturnType<typeof fetchAmbulances>>;
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
  guards: Awaited<ReturnType<typeof fetchGuards>>;
  ambulances: Awaited<ReturnType<typeof fetchAmbulances>>;
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
  const coveragePercent = totalAmbulances
    ? Math.round((activeAmbulances / totalAmbulances) * 100)
    : 0;
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
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {DASHBOARD_SECTIONS_COPY.guards.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {DASHBOARD_SECTIONS_COPY.guards.subtitle}
          </p>
        </div>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          Actualizado hace 2 min
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-3 text-center">
          <ExclamationTriangleIcon className="mx-auto mb-1 h-5 w-5 text-rose-600" />
          <p className="text-2xl font-semibold text-rose-900">
            {criticalUnitCount}
          </p>
          <p className="text-xs font-medium text-rose-700">
            Unidades con riesgo
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-3 text-center">
          <CalendarIcon className="mx-auto mb-1 h-5 w-5 text-amber-600" />
          <p className="text-2xl font-semibold text-amber-900">
            {inactiveAmbulances}
          </p>
          <p className="text-xs font-medium text-amber-700">
            Unidades sin guardia
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3 text-center">
          <TruckIcon className="mx-auto mb-1 h-5 w-5 text-emerald-600" />
          <p className="text-2xl font-semibold text-emerald-900">
            {maxDeficit}
          </p>
          <p className="text-xs font-medium text-emerald-700">Deficit maximo</p>
        </div>
      </div>

      <section className="space-y-3" aria-label="Requiere atencion">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
          {DASHBOARD_SECTIONS_COPY.guards.needsAttentionTitle}
        </h3>
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
              <ExclamationTriangleIcon className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Insumos criticos en unidades operativas
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <CalendarIcon className="h-3 w-3" />
                <span>
                  {criticalUnitCount} unidad(es) con insumos por debajo del
                  minimo
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700">
            Critica
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <CalendarIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Cobertura operativa comprometida
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <CalendarIcon className="h-3 w-3" />
                <span>{inactiveAmbulances} unidad(es) sin guardia activa</span>
              </div>
            </div>
          </div>
          <div className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-700">
            Media
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-900">
          {DASHBOARD_SECTIONS_COPY.guards.topCriticalTitle}
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
            No hay insumos criticos registrados.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-900">
          {DASHBOARD_SECTIONS_COPY.guards.nextHoursTitle}
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {nextTasks.map((task) => (
            <div
              key={task}
              className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700"
            >
              {task}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-medium text-slate-500">
          {DASHBOARD_SECTIONS_COPY.guards.mobileCoverageLabel}:{" "}
          {coveragePercent}%
        </p>
      </section>
    </article>
  );
}

export function DelegationStats({
  guards,
  delegations,
  ambulances,
}: {
  guards: Awaited<ReturnType<typeof fetchGuards>>;
  delegations: Awaited<ReturnType<typeof fetchDelegations>>;
  ambulances: Awaited<ReturnType<typeof fetchAmbulances>>;
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
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {DASHBOARD_SECTIONS_COPY.delegation.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {DASHBOARD_SECTIONS_COPY.delegation.subtitle}
          </p>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {globalCoverage}% cobertura global
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-3 text-center">
          <BuildingOffice2Icon className="mx-auto mb-1 h-5 w-5 text-sky-600" />
          <p className="text-2xl font-semibold text-sky-900">
            {activeDelegations.length}
          </p>
          <p className="text-xs font-medium text-sky-700">
            Delegaciones activas
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-3 text-center">
          <TruckIcon className="mx-auto mb-1 h-5 w-5 text-rose-600" />
          <p className="text-2xl font-semibold text-rose-900">
            {totalAvailable}
          </p>
          <p className="text-xs font-medium text-rose-700">
            Ambulancias operativas
          </p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-3 text-center">
          <ExclamationTriangleIcon className="mx-auto mb-1 h-5 w-5 text-amber-600" />
          <p className="text-2xl font-semibold text-amber-900">
            {totalPending}
          </p>
          <p className="text-xs font-medium text-amber-700">
            Unidades pendientes
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {topDelegations.length ? (
          topDelegations.map(
            ({ delegation, coverage, available, pending, total }) => {
              const statusLabel = coverage >= 80 ? "Estable" : "Seguimiento";
              const statusClass =
                coverage >= 80
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700";

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
                    <div
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}
                    >
                      {statusLabel}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {DASHBOARD_SECTIONS_COPY.delegation.unitCoverageLabel}
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
                        {DASHBOARD_SECTIONS_COPY.delegation.availableLabel}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-800">
                        {available} de {total}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        {DASHBOARD_SECTIONS_COPY.delegation.pendingLabel}
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
