import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchSuppliesByPharmacyId } from "@/app/lib/data/supplies";
import { getPaginationParams } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import PharmacySuppliesTable from "@/app/ui/dashboard/supplies/pharmacies/supplies-table";
import SupplyForm from "@/app/ui/dashboard/supplies/pharmacies/create/supply-form";

export const metadata: Metadata = {
  title: "Gestión de Insumos en Farmacia",
};

export default async function PharmacySuppliesPage({
  searchParams,
}: {
  searchParams: Promise<{
    pharmacy: string;
    page?: number;
    display?: number;
  }>;
}) {
  // (Página) Gestionar insumos en farmacia - [SSR]

  let { pharmacy: pharmacyId, page, display } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  const fetchsuppliesByPharmacyId = async () =>
    Promise.all([
      fetchSuppliesByPharmacyId(pharmacyId, params),
      fetchDelegations().then((result) => result.data),
      pharmacyId,
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Farmacia",
            href: `/dashboard/supplies/pharmacies?pharmacy=${pharmacyId}`,
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Ambulancia"
            modelContent={
              <SupplyForm pharmacyId={pharmacyId} delegations={[]} />
            }
          />
        }
      >
        <WrapperTable
          fetchData={fetchsuppliesByPharmacyId}
          WrappedComponent={PharmacySuppliesTable}
        />
      </Suspense>
    </section>
  );
}
