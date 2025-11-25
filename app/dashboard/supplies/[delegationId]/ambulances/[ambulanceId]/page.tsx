import { fetchDelegations } from "@/app/lib/data";
import { fetchAmbulancesByDelegationId } from "@/app/lib/data/ambulances";
import { fetchSuppliesByAmbulanceId } from "@/app/lib/data/supplies";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import AmbulanceSuppliesTable from "@/app/ui/dashboard/supplies/ambulances/supplies-table";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gestión de Insumos en Ambulancias",
};

export default async function AmbulancesSuppliesPage(props: {
  params: Promise<{ delegationId: string; ambulanceId: string }>;
}) {
  // (Página) Gestionar insumos en ambulancias - [SSR]

  const params = await props.params;
  const delegationId = params.delegationId;
  const ambulanceId = params.ambulanceId;

  const fetchData = async () =>
    await Promise.all([
      fetchDelegations(),
      fetchAmbulancesByDelegationId(delegationId),
      fetchSuppliesByAmbulanceId(ambulanceId),
    ]);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Farmacia",
            href: `/dashboard/supplies/${delegationId}/pharmacies`,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton title="Crear Ambulancia" modelContent={<div></div>} />
        }
      >
        <WrapperTable
          fetchData={fetchData}
          WrappedComponent={AmbulanceSuppliesTable}
        />
      </Suspense>
    </>
  );
}
