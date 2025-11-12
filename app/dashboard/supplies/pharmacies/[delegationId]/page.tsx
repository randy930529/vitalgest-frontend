import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchDelegationById } from "@/app/lib/data";
import { fetchSupplies } from "@/app/lib/data/supplies";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import SuppliesTable from "@/app/ui/dashboard/supplies/pharmacies/supplies-table";
import SupplyForm from "@/app/ui/dashboard/supplies/pharmacies/create/supply-form";

export const metadata: Metadata = {
  title: "Gestión de Insumos en Farmacia",
};

export default async function PharmacySuppliesPage(props: {
  params: Promise<{ delegationId: string }>;
}) {
  // (Página) Gestionar insumos en farmacia - [SSR]
  const params = await props.params;
  const delegationId = params.delegationId;
  const fetchPharmacyByDelegationId = await fetchDelegationById(delegationId);

  if (!fetchPharmacyByDelegationId || !fetchPharmacyByDelegationId.pharmacy) {
    return notFound();
  }

  const pharmacyId = fetchPharmacyByDelegationId.pharmacy.id;
  const fetchsupplies = async () => await fetchSupplies(pharmacyId);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Farmacia",
            href: `/dashboard/supplies/${delegationId}`,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Ambulancia"
            modelContent={<SupplyForm pharmacyId={pharmacyId} />}
          />
        }
      >
        <WrapperTable
          fetchData={fetchsupplies}
          WrappedComponent={SuppliesTable}
        />
      </Suspense>
    </>
  );
}
