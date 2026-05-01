import { Suspense } from "react";
import { GuardType, PaginatedResult, UserType } from "@/app/lib/definitions";
import { fetchGuardsAndInlineGuardByUserMe } from "@/app/lib/data/guards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";
import { EmptyStateCard, ErrorStateCard } from "@/app/ui/state-feedback";
import { fetchStaffMembers } from "@/app/lib/data/users";

export default async function GuardsTableSection({
  user,
  isClient,
}: {
  user: UserType;
  isClient?: boolean;
}) {
  let guards: PaginatedResult<GuardType> = { data: [], totalRecords: 0 };
  let hasLoadError = false;

  try {
    [guards] = await fetchGuardsAndInlineGuardByUserMe(user);
  } catch (error) {
    hasLoadError = true;
  }

  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      guards,
      fetchAmbulances().then((result) => result.data),
      fetchDelegations().then((result) => result.data),
      fetchStaffMembers(),
    ]);

  return (
    <section className="min-w-full rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] sm:p-6">
      <header className="text-left">
        <h2
          id="historial-guardias-title"
          className="text-xl font-bold text-slate-900 md:text-2xl"
        >
          Historial de guardias
        </h2>
        <p className="mt-1 text-sm text-slate-600 md:text-base">
          Consulta tus guardias anteriores y estatus.
        </p>
        {hasLoadError && (
          <div className="mt-3">
            <ErrorStateCard
              title="No fue posible cargar el historial de guardias."
              description="Recarga la página o inténtalo de nuevo en unos minutos."
            />
          </div>
        )}

        {!hasLoadError && !guards.data.length && (
          <div className="mt-3">
            <EmptyStateCard
              title="No se obtuvieron guardias para mostrar."
              description="Crea una guardia para comenzar a registrar turnos y su operación diaria."
              actionLabel="Ir a crear guardia"
              actionHref="/dashboard/guards"
            />
          </div>
        )}
      </header>
      {!hasLoadError && !!guards.data.length && (
        <Suspense
          fallback={
            <TableSkeleton
              title="Crear Guardia"
              modelContent={
                <GuardForm
                  guardChiefs={[]}
                  delegations={[]}
                  ambulances={[]}
                  drivers={[]}
                  paramedicals={[]}
                />
              }
            />
          }
        >
          <WrapperTable
            fetchData={fetchGuardsGuardChiefsAndDelegations}
            WrappedComponent={GuardsTable}
            readonly={isClient}
            route="/guards"
          />
        </Suspense>
      )}
    </section>
  );
}
