import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { QueryParamsType, UserType } from "@/app/lib/definitions";
import { fetchGuardsAndInlineGuardByUserMe } from "@/app/lib/data/guards";
import { getSession } from "@/app/lib/dal";
import { getPaginationParams } from "@/app/lib/utils";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { fetchStaffMembers } from "@/app/lib/data/users";
import {
  fetchAmbulances,
  fetchAmbulancesByDelegationId,
} from "@/app/lib/data/ambulances";
import {
  fetchDelegations,
  fetchDelegationsByIds,
} from "@/app/lib/data/delegations";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";

export const metadata: Metadata = {
  title: "Historial de Guardias",
};

export default async function GuardsPage({
  searchParams,
}: {
  searchParams: Promise<QueryParamsType>;
}) {
  // (Página) Gestionar guardias - [SSR]

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const isAdmin = ROLE_MANAGER.isAdmin(user.role);
  const readonly = !ROLE_MANAGER.isHeadGuard(user.role) && !isAdmin;

  const { page, display } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  const getAmbulances = isAdmin
    ? () => fetchAmbulances()
    : () => fetchAmbulancesByDelegationId(user.delegationId);
  const getDelegations = isAdmin
    ? () => fetchDelegations()
    : () => fetchDelegationsByIds([user.delegationId]);

  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      fetchGuardsAndInlineGuardByUserMe(user).then((result) => result[0]),
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
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          { label: "Guardias", href: "/history/guards", active: true },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Guardia"
            modelContent={
              <GuardForm
                guardChiefs={[]}
                delegations={[]}
                ambulances={[]}
                drivers={[]}
                paramedicals={[]}
              />
            }
          />
        }
      >
        <WrapperTable
          fetchData={fetchGuardsGuardChiefsAndDelegations}
          WrappedComponent={GuardsTable}
          readonly={readonly}
          route="/history/guards"
          userRole={user.role}
        />
      </Suspense>
    </section>
  );
}
