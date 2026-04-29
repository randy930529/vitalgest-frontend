import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import AmbulanceTable from "@/app/ui/dashboard/ambulances/ambulance-table";
import AmbulanceForm from "@/app/ui/dashboard/ambulances/create/ambulance-form";
import { getPaginationParams } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Gestión de Ambulancias",
};

export default async function AmbulancePage({
  searchParams,
}: {
  searchParams: { page?: number; display?: number };
}) {
  // (Página) Listado de ambulancias - [SSR]

  const { page = 1, display = 6 } = searchParams;
  const fetchAmbulancesAndDelegations = async () =>
    await Promise.all([
      fetchAmbulances(getPaginationParams(page, display)),
      fetchDelegations().then((result) => result.data),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Ambulancias", href: "/dashboard/ambulances", active: true },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Ambulancia"
            modelContent={<AmbulanceForm />}
          />
        }
      >
        <WrapperTable
          fetchData={fetchAmbulancesAndDelegations}
          WrappedComponent={AmbulanceTable}
        />
      </Suspense>
    </section>
  );
}
