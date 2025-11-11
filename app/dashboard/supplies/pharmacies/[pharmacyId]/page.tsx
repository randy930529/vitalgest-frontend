import { Suspense } from "react";
import { Metadata } from "next";
import { fetchSupplies } from "@/app/lib/data/supplies";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import SuppliesTable from "@/app/ui/dashboard/supplies/pharmacies/supplies-table";

export const metadata: Metadata = {
  title: "Gestión de Insumos en Farmacia",
};

export default async function PharmacySuppliesPage(props: {
  params: Promise<{ pharmacyId: string }>;
}) {
  // (Página) Gestionar insumos en farmacia - [SSR]
  const params = await props.params;
  const pharmacyId = params.pharmacyId;

  const fetchsupplies = async () => await fetchSupplies(pharmacyId);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Farmacia",
            href: `/dashboard/supplies/${pharmacyId}`,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Ambulancia"
            modelContent={<>Formulario de suministros</>}
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
