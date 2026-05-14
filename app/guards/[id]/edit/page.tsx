import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchGuardById } from "@/app/lib/data/guards";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/components/skeletons";
import GuardEditForm from "@/app/ui/dashboard/guards/edit/guard-edit-form";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchShiftsByGuardId } from "@/app/lib/data/shifts";
import { fetchStaffMembers } from "@/app/lib/data/users";

export const metadata: Metadata = {
  title: "Editar Guardia",
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
      fetchShiftsByGuardId(id),
      fetchAmbulances().then((result) => result.data),
      fetchDelegations().then((result) => result.data),
      (async () => {
        const session = await getSession();
        if (!session) {
          redirect("/login");
        }
        const authorizedUser = session.user;
        return fetchStaffMembers(authorizedUser.delegationId);
      })(),
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
