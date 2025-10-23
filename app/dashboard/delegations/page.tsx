import { Suspense } from "react";
import { fetchDelegations, fetchMxStates } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import DelegationTable from "@/app/ui/dashboard/delegations/delegation-table";
import DelegationForm from "@/app/ui/dashboard/delegations/create/delegation-form";

export default async function DelegationsPage() {
  // (Página) Gestionar delegaciones - [SSR]

  const fetchDataDelegationsAndMXStates = async () =>
    await Promise.all([fetchDelegations(), fetchMxStates()]);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Delegaciones", href: "/dashboard/delegations" },
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
    </>
  );
}
