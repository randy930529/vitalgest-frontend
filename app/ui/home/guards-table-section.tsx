import { GuardType } from "@/app/lib/definitions";
import GuardsTable from "../dashboard/guards/guards-table";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import {
  fetchDelegations,
  fetchUsersGuardChiefsDriversAndParamedical,
} from "@/app/lib/data";
import { Suspense } from "react";
import { TableSkeleton } from "../dashboard/skeletons";
import GuardForm from "../dashboard/guards/create/guard-form";
import { WrapperTable } from "../dashboard/wrappers";

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
          />
        </Suspense>
      )}
    </section>
  );
}
