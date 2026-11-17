import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/dal";
import { UserType } from "@/app/lib/definitions";
import {
  fetchDelegations,
  fetchDelegationsByIds,
} from "@/app/lib/data/delegations";
import { fetchGuardById } from "@/app/lib/data/guards";
import {
  fetchAmbulances,
  fetchAmbulancesByDelegationId,
} from "@/app/lib/data/ambulances";
import { fetchShiftsByGuardId } from "@/app/lib/data/shifts";
import { fetchStaffMembers } from "@/app/lib/data/users";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/components/skeletons";
import GuardEditForm from "@/app/ui/dashboard/guards/edit/guard-edit-form";

export const metadata: Metadata = {
  title: "Editar Guardia",
};

export default async function EditGuardPage(props: {
  params: Promise<{ id: string }>;
}) {
  // (Página) Editar Guardia - [SSR]

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const isAdmin = ROLE_MANAGER.isAdmin(user.role);

  const params = await props.params;
  const id = params.id;

  const getAmbulances = isAdmin
    ? () => fetchAmbulances()
    : () => fetchAmbulancesByDelegationId(user.delegationId);
  const getDelegations = isAdmin
    ? () => fetchDelegations()
    : () => fetchDelegationsByIds([user.delegationId]);

  const fetchGuardByIdAndMXStates = async () =>
    await Promise.all([
      fetchGuardById(id),
      fetchShiftsByGuardId(id),
      getAmbulances().then((result) => result.data),
      getDelegations().then((result) => result.data),
      fetchStaffMembers(user.delegationId, isAdmin).then<
        [UserType[], UserType[], UserType[]]
      >(([guardChiefs, drivers, paramedicals]) =>
        isAdmin
          ? [guardChiefs, drivers, paramedicals]
          : [
              guardChiefs.filter((g) => g.id === user.id),
              drivers,
              paramedicals,
            ],
      ),
    ]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          { label: "Guardias", href: "/history/guards" },
          {
            label: "Editar Guardia",
            href: `/history/guards/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<FormSkeleton goBackUrl="/history/guards" />}>
        <WrapperForm
          fetchData={fetchGuardByIdAndMXStates}
          WrappedComponent={GuardEditForm}
        />
      </Suspense>
    </section>
  );
}
