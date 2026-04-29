import { Suspense } from "react";
import { Metadata } from "next";
import { fetchMxStates } from "@/app/lib/data/locations";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import DelegationTable from "@/app/ui/dashboard/delegations/delegation-table";
import DelegationForm from "@/app/ui/dashboard/delegations/create/delegation-form";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { getPaginationParams } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Gestión de Delegaciones",
};

export default async function DelegationsPage({
  searchParams,
}: {
  searchParams: { page?: number; display?: number };
}) {
  // (Página) Gestionar delegaciones - [SSR]

  const { page = 1, display = 6 } = searchParams;
  const fetchDataDelegationsAndMXStates = async () =>
    await Promise.all([
      fetchDelegations(getPaginationParams(page, display)),
      fetchMxStates(),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Delegaciones",
            href: "/dashboard/delegations",
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Delegación"
            modelContent={<DelegationForm customMxStates={[]} />}
          />
        }
      >
        <WrapperTable
          fetchData={fetchDataDelegationsAndMXStates}
          WrappedComponent={DelegationTable}
        />
      </Suspense>
    </section>
  );
}
