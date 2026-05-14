import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations } from "@/app/lib/data/delegations";
import { fetchUsers } from "@/app/lib/data/users";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/components/skeletons";
import UserTable from "@/app/ui/dashboard/users/user-table";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import UserForm from "@/app/ui/dashboard/users/create/user-form";
import type { UserType } from "@/app/lib/definitions";
import { getPaginationParams } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Gestión de Usuarios",
};

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; display?: string }>;
}) {
  // (Página) Listado de usuarios - [SSR]

  const { page, display } = await searchParams;
  const fetchDataUsersAndDelegations = async () =>
    await Promise.all([
      fetchUsers(getPaginationParams(Number(page) || 1, Number(display) || 6)),
      fetchDelegations().then((result) => result.data),
    ]);

  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Usuarios", href: "/dashboard/users", active: true },
        ]}
      />
      <Suspense
        fallback={
          <TableSkeleton title="Crear Usuario" modelContent={<UserForm />} />
        }
      >
        <WrapperTable
          fetchData={fetchDataUsersAndDelegations}
          WrappedComponent={UserTable}
        />
      </Suspense>
    </section>
  );
}
