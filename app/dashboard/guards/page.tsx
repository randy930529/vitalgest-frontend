import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchGuards } from "@/app/lib/data/guards";
import { fetchAmbulances } from "@/app/lib/data/ambulances";
import { fetchStaffMembers } from "@/app/lib/data/users";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { getPaginationParams } from "@/app/lib/utils";
import { getSession } from "@/app/lib/dal";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import GuardForm from "@/app/ui/dashboard/guards/create/guard-form";

export const metadata: Metadata = {
  title: "Gestión de Guardias",
};

export default async function GuardsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; display?: string }>;
}) {
  // (Página) Gestionar guardias - [SSR]

  const { page, display } = await searchParams;
  const fetchGuardsGuardChiefsAndDelegations = async () =>
    await Promise.all([
      fetchGuards(getPaginationParams(Number(page) || 1, Number(display) || 6)),
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
        />
      </Suspense>
    </section>
  );
}
