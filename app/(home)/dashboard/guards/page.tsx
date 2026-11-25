import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { QueryParamsType } from "@/app/lib/definitions";
import { fetchGuards } from "@/app/lib/data/guards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchStaffMembers } from "@/app/lib/data/users";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { ROLE_MANAGER } from "@/app/lib/config/constants";
import { getPaginationParams } from "@/app/lib/utils";
import { getSession } from "@/app/lib/dal";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import {
  GuardFormSkeleton,
  TableSkeleton,
} from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";

export const metadata: Metadata = {
  title: "Gestión de Guardias",
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

  const userRole = session.user?.role;
  const isAdmin = ROLE_MANAGER.isAdmin(userRole);

  const { page, display } = await searchParams;
  const params = getPaginationParams(Number(page), Number(display));

  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      fetchGuards(params),
      fetchAmbulances().then((result) => result.data),
      fetchDelegations().then((result) => result.data),
      fetchStaffMembers(session.user?.delegationId, isAdmin),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Guardias", href: "/dashboard/guards", active: true },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton
            title="Crear Guardia"
            modelContent={<GuardFormSkeleton />}
          />
        }
      >
        <WrapperTable
          fetchData={fetchGuardsGuardChiefsAndDelegations}
          WrappedComponent={GuardsTable}
          readonly={!isAdmin}
          userRole={userRole}
        />
      </Suspense>
    </section>
  );
}
