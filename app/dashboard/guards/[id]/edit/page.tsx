import { Suspense } from "react";
import { Metadata } from "next";
import {
  fetchDelegations,
  fetchGuardById,
  fetchUsersGuardChief,
  fetchUsersGuardChiefsDriversAndParamedical,
} from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import GuardEditForm from "@/app/ui/dashboard/guards/edit/guard-edit-form";

export const metadata: Metadata = {
  title: "Editar Delegación",
};

export default async function EditGuardPage(props: {
  params: Promise<{ id: string }>;
}) {
  // (Página) Editar Guardia - [SSR]

  const params = await props.params;
  const id = params.id;

  const fetchGuardByIdAndMXStates = async () =>
    await Promise.all([
      fetchGuardById(id),
      fetchDelegations(),
      fetchUsersGuardChief(),
      fetchUsersGuardChiefsDriversAndParamedical(),
    ]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Guardias", href: "/dashboard/guards" },
          {
            label: "Editar Guardia",
            href: `/dashboard/guards/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/dashboard/users" />}>
        <WrapperForm
          fetchData={fetchGuardByIdAndMXStates}
          WrappedComponent={GuardEditForm}
        />
      </Suspense>
    </section>
  );
}
