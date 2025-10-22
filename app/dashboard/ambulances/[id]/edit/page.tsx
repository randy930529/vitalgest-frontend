import { Suspense } from "react";
import { Metadata } from "next";
import { fetchAmbulanceById, fetchDelegations } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import AmbulanceEditForm from "@/app/ui/dashboard/ambulances/edit/ambulance-edit-form";

export const metadata: Metadata = {
  title: "Editar Ambulancia",
};

export default async function EditAmbulancePage(props: {
  params: Promise<{ id: string }>;
}) {
  // <div>(Página) Editar Ambulancia - [SSR]</div>
  const params = await props.params;
  const id = params.id;
  const ambulance = await fetchAmbulanceById(id);

  const fetchAmbulanceByIdAndDelegations = async () =>
    await Promise.all([fetchAmbulanceById(id), fetchDelegations()]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Ambulancias", href: "/dashboard/ambulances" },
          {
            label: "Editar Ambulancia",
            href: `/dashboard/ambulances/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/dashboard/ambulances" />}>
        <WrapperForm
          fetchData={fetchAmbulanceByIdAndDelegations}
          WrappedComponent={AmbulanceEditForm}
        />
      </Suspense>
    </section>
  );
}
