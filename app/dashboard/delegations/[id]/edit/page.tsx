import { Suspense } from "react";
import { Metadata } from "next";
import { fetchMxStates } from "@/app/lib/data/locations";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import DelegationEditForm from "@/app/ui/dashboard/delegations/edit/delegation-edit-form";
import { fetchDelegationById } from "@/app/lib/data/delegations";

export const metadata: Metadata = {
  title: "Editar Delegación",
};

export default async function EditDelegationPage(props: {
  params: Promise<{ id: string }>;
}) {
  // (Página) Editar Delegación - [SSR]

  const params = await props.params;
  const id = params.id;

  const fetchDelegationByIdAndMXStates = async () =>
    await Promise.all([fetchDelegationById(id), fetchMxStates()]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Delegaciones", href: "/dashboard/delegations" },
          {
            label: "Editar Delegación",
            href: `/dashboard/delegations/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/dashboard/users" />}>
        <WrapperForm
          fetchData={fetchDelegationByIdAndMXStates}
          WrappedComponent={DelegationEditForm}
        />
      </Suspense>
    </section>
  );
}
