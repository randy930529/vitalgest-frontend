import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import { fetchSupplyById } from "@/app/lib/data/supplies";
import SupplyEditForm from "@/app/ui/dashboard/supplies/pharmacies/edit/supply-edit-form";

export const metadata: Metadata = {
  title: "Editar Insumo",
};

export default async function PharmacySuppliesEditPage(props: {
  params: Promise<{ delegationId: string; id: string }>;
}) {
  const params = await props.params;
  const delegationId = params.delegationId;
  const id = params.id;

  const fetchSupply = async () =>
    await Promise.all([fetchSupplyById(id), delegationId]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Insumos en Farmacia",
            href: `/dashboard/supplies/${delegationId}/pharmacies`,
          },
          {
            label: "Editar Insumo",
            href: `/dashboard/supplies/${delegationId}/pharmacies/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={
          <FormSkeleton
            goBackUrl={`/dashboard/supplies/pharmacies/${delegationId}`}
          />
        }
      >
        <WrapperForm
          fetchData={fetchSupply}
          WrappedComponent={SupplyEditForm}
        />
      </Suspense>
    </section>
  );
}
