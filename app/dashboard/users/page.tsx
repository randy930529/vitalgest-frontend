import Breadcrumbs from "@/app/ui/dashboard/users/breadcrumbs";
import UserTable from "@/app/ui/dashboard/users/user-table";

export default async function Page() {
  // <div>(Página) Listado de usuarios - [SSR]</div>
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[{ label: "Usuarios", href: "/dashboard/users" }]}
      />
      <h2 className="text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        Gestión de Usuarios del Sistema
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        Administrar usuarios que tienen acceso al sistema
      </p>
      <UserTable />
    </section>
  );
}
