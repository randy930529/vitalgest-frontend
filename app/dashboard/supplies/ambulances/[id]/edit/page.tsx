import { Suspense } from "react";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchAmbulanceSupplyById } from "@/app/lib/data/supplies";
import {
  fetchAmbulanceAreas,
  fetchAmbulances,
} from "@/app/lib/data/ambulances";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/components/skeletons";
import SupplyEditForm from "@/app/ui/dashboard/supplies/ambulances/edit/supply-edit-form";

export default async function AmbulanceSupplyEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    ambulance: string;
    pharmacy: string;
  }>;
}) {
  const { id } = await params;
  let { ambulance: ambulanceId, pharmacy: pharmacyId } = await searchParams;

  if (!ambulanceId) {
    const [delegations, ambulances] = await Promise.all([
      fetchDelegations().then((result) => result.data),
      fetchAmbulances().then((result) => result.data),
    ]);
    ambulanceId = ambulances[0]?.id || "";

    const delegationId = ambulances[0]?.delegation?.id || "";
    pharmacyId =
      delegations.find(({ id }) => id === delegationId)?.pharmacy.id || "";
  }

  const fetchSupplyByIdAndAmbulances = async () =>
    await Promise.all([
      fetchAmbulanceSupplyById(id),
      ambulanceId,
      fetchAmbulances().then((result) => result.data),
      fetchAmbulanceAreas().then((result) => result.data),
    ]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Ambulancia",
            href: `/dashboard/supplies/ambulances`,
          },
          {
            label: "Editar Insumo",
            href: `/dashboard/supplies/ambulances/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={<FormSkeleton goBackUrl={`/dashboard/supplies/pharmacies`} />}
      >
        <WrapperForm
          fetchData={fetchSupplyByIdAndAmbulances}
          WrappedComponent={SupplyEditForm}
        />
      </Suspense>
    </section>
  );
}
