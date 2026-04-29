import { Suspense } from "react";
import { Metadata } from "next";
import { fetchGuards } from "@/app/lib/data/guards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchStaffMembers } from "@/app/lib/data/users";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { getPaginationParams } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";

export const metadata: Metadata = {
  title: "Gestión de Guardias",
};

export default async function GuardsPage({
  searchParams,
}: {
  searchParams: { page?: number; display?: number };
}) {
  // (Página) Gestionar guardias - [SSR]

  const { page = 1, display = 6 } = searchParams;
  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      fetchGuards(getPaginationParams(page, display)),
      fetchAmbulances().then((result) => result.data),
      fetchDelegations().then((result) => result.data),
      fetchStaffMembers(),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Guardias", href: "/dashboard/guards", active: true },
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
    </section>
  );
}
