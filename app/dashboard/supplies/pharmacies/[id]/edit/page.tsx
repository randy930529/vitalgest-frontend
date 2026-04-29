import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data/delegations";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import { fetchSupplyById } from "@/app/lib/data/supplies";
import SupplyEditForm from "@/app/ui/dashboard/supplies/pharmacies/edit/supply-edit-form";

export const metadata: Metadata = {
  title: "Editar Insumo",
};

export default async function PharmacySuppliesEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const fetchSupplyByIdAndDelegations = async () =>
    await Promise.all([
      fetchSupplyById(id),
      fetchDelegations().then((result) => result.data),
    ]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Farmacia",
            href: `/dashboard/supplies/pharmacies`,
          },
          {
            label: "Editar Insumo",
            href: `/dashboard/supplies/pharmacies/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={<FormSkeleton goBackUrl={`/dashboard/supplies/pharmacies`} />}
      >
        <WrapperForm
          fetchData={fetchSupplyByIdAndDelegations}
          WrappedComponent={SupplyEditForm}
        />
      </Suspense>
    </section>
  );
}
