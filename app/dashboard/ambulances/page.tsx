import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import AmbulanceTable from "@/app/ui/dashboard/ambulances/ambulance-table";
import AmbulanceForm from "@/app/ui/dashboard/ambulances/create/ambulance-form";

export const metadata: Metadata = {
  title: "Gestión de Ambulancias",
};

export default async function AmbulancePage() {
  // (Página) Listado de ambulancias - [SSR]

  const fetchAmbulancesAndDelegations = async () =>
    await Promise.all([fetchAmbulances(), fetchDelegations()]);

  return (
    <>
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
    </>
  );
}
