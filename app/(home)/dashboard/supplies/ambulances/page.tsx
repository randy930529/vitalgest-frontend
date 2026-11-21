import { Suspense } from "react";
import { Metadata } from "next";
import {
  fetchAmbulanceAreas,
  fetchAmbulances,
} from "@/app/lib/data/ambulances";
import {
  fetchSuppliesByAmbulanceId,
  fetchSuppliesByPharmacyId,
} from "@/app/lib/data/supplies";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { getPaginationParams } from "@/app/lib/utils";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import SupplyForm from "@/app/ui/dashboard/supplies/ambulances/create/supply-form";
import AmbulanceSuppliesTable from "@/app/ui/dashboard/supplies/ambulances/supplies-table";

export const metadata: Metadata = {
  title: "Gestión de Insumos en Ambulancias",
};

export default async function AmbulancesSuppliesPage({
  searchParams,
}: {
  searchParams: Promise<{
    ambulance: string;
    pharmacy: string;
    page?: number;
    display?: number;
  }>;
}) {
  // (Página) Gestionar insumos en ambulancias - [SSR]

  let {
    ambulance: ambulanceId,
    pharmacy: pharmacyId,
    page,
    display,
  } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  const fetchAmbulancesAndSupplies = async () =>
    await Promise.all([
      fetchAmbulances().then((result) => result.data),
      fetchSuppliesByAmbulanceId(ambulanceId, params),
      ambulanceId,
      fetchAmbulanceAreas().then((result) => result.data),
      fetchSuppliesByPharmacyId(pharmacyId).then((result) => result.data),
      fetchDelegations().then((result) => result.data),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Ambulancia",
            href: `/dashboard/supplies/pharmacies?ambulance=${ambulanceId}`,
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Ambulancia"
            modelContent={
              <SupplyForm
                ambulanceId={ambulanceId}
                ambulances={[]}
                areas={[]}
                suppliesPharmacy={[]}
              />
            }
          />
        }
      >
        <WrapperTable
          fetchData={fetchAmbulancesAndSupplies}
          WrappedComponent={AmbulanceSuppliesTable}
        />
      </Suspense>
    </section>
  );
}
