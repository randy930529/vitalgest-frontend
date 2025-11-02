import { Suspense } from "react";
import { Metadata } from "next";
import {
  fetchDelegations,
  fetchGuards,
  fetchUsersGuardChief,
  fetchUsersGuardChiefsDriversAndParamedical,
} from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";

export const metadata: Metadata = {
  title: "Gestión de Guardias",
};

export default async function GuardsPage() {
  // (Página) Gestionar guardias - [SSR]

  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      fetchGuards(),
      fetchUsersGuardChief(),
      fetchDelegations(),
      fetchUsersGuardChiefsDriversAndParamedical(),
    ]);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Guardias", href: "/dashboard/guards" },
        ]}
      />
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
        />
      </Suspense>
    </>
  );
}
