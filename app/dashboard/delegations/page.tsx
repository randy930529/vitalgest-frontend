import DelegationTable from "@/app/ui/dashboard/delegations/delegation-table";
import Breadcrumbs from "@/app/ui/dashboard/users/breadcrumbs";

export default async function Page() {
  // <div>(Página) Gestionar delegaciones - [SSR]</div>

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Delegaciones", href: "/dashboard/delegations" },
        ]}
      />
      <h2 className="text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        Gestión de Delegaciones
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        Administrar delegaciones en el sistema
      </p>
      <DelegationTable />
    </section>
  );
}
