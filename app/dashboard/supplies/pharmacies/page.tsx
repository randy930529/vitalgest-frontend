import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { getSession } from "@/app/lib/dal";
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

  let { pharmacy: pharmacyId, page = 1, display = 6 } = await searchParams;

  const { data: delegations } = await fetchDelegations();

  if (!pharmacyId) {
    const delegationId = (await getSession())?.user.delegationId;

    if (delegationId) {
      pharmacyId =
        delegations.find(({ id }) => id === delegationId)?.pharmacy.id || "";
    }
  }

  if (!pharmacyId) {
    return notFound();
  }

  const fetchsuppliesByPharmacyId = async () =>
    Promise.all([
      fetchSuppliesByPharmacyId(pharmacyId, getPaginationParams(page, display)),
      delegations,
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
              <SupplyForm pharmacyId={pharmacyId} delegations={delegations} />
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
