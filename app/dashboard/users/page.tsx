import Breadcrumbs from "@/app/ui/breadcrumbs";
import UserTable from "@/app/ui/dashboard/users/user-table";

export default async function UserPage() {
  // <div>(Página) Listado de usuarios - [SSR]</div>
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Usuarios", href: "/dashboard/users" },
        ]}
      />
      <UserTable />
    </>
  );
}
