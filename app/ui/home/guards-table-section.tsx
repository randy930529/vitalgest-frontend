import { Suspense } from "react";
import { GuardType } from "@/app/lib/definitions";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import {
  fetchDelegations,
  fetchUsersGuardChiefsDriversAndParamedical,
} from "@/app/lib/data";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";

export default async function GuardsTableSection({
  guards,
  isClient,
}: {
  guards: GuardType[];
  isClient?: boolean;
}) {
  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      guards,
      fetchAmbulances(),
      fetchDelegations(),
      fetchUsersGuardChiefsDriversAndParamedical(),
    ]);

  return (
    <section className="bg-white rounded-lg min-w-full">
      <div className="text-center md:text-left">
        <h1 className="text-xl md:text-2xl font-bold dark:text-white">
          Mi Historial de Guardias
        </h1>
        {!guards.length && (
          <p className="text-gray-500 dark:text-gray-400 md:ms-2">
            No se obtuvieron guardias para mostrar.
          </p>
        )}
      </div>
      {!!guards.length && (
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
