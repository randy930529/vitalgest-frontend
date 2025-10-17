import Breadcrumbs from "@/app/ui/breadcrumbs";
import AmbulanceTable from "@/app/ui/dashboard/ambulances/ambulance-table";
import { fetchAmbulances } from "@/app/lib/data";

export default async function AmbulancePage() {
  const ambulances = await fetchAmbulances();

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Ambulancias", href: "/dashboard/ambulances" },
        ]}
      />
      <AmbulanceTable ambulances={ambulances} />
    </>
  );
}
