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
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import SupplyForm from "@/app/ui/dashboard/supplies/ambulances/create/supply-form";
import AmbulanceSuppliesTable from "@/app/ui/dashboard/supplies/ambulances/supplies-table";
import { getSession } from "@/app/lib/dal";
import { fetchDelegations } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Gestión de Insumos en Ambulancias",
};

export default async function AmbulancesSuppliesPage({
  searchParams,
}: {
  searchParams: Promise<{
    ambulance: string;
    pharmacy: string;
  }>;
}) {
  // (Página) Gestionar insumos en ambulancias - [SSR]

  let { ambulance: ambulanceId, pharmacy: pharmacyId } = await searchParams;

  if (!ambulanceId) {
    const [delegations, ambulances] = await Promise.all([
      fetchDelegations(),
      fetchAmbulances(),
    ]);
    ambulanceId = ambulances[0]?.id || "";

    const delegationId = ambulances[0]?.delegation?.id || "";
    pharmacyId =
      delegations.find(({ id }) => id === delegationId)?.pharmacy.id || "";
  }

  const fetchAmbulancesAndSupplies = async () =>
    await Promise.all([
      fetchAmbulances(),
      fetchSuppliesByAmbulanceId(ambulanceId),
      ambulanceId,
      fetchAmbulanceAreas(),
      fetchSuppliesByPharmacyId(pharmacyId),
      fetchDelegations(),
    ]);

  return (
    <>
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
    </>
  );
}
