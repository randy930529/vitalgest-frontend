import { Suspense } from "react";
import { Metadata } from "next";
import { fetchDelegations, fetchUsers } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import UserTable from "@/app/ui/dashboard/users/user-table";
import { WrapperTable } from "@/app/ui/dashboard/wrappers";
import UserForm from "@/app/ui/dashboard/users/create/user-form";

export const metadata: Metadata = {
  title: "Gestión de Usuarios",
};

export default async function UserPage() {
  // <div>(Página) Listado de usuarios - [SSR]</div>

  const fetchDataUsersAndDelegations = async () =>
    await Promise.all([fetchUsers(), fetchDelegations()]);

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Usuarios", href: "/dashboard/users" },
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
    </>
  );
}
