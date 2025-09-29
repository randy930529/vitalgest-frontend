import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import Breadcrumbs from "@/app/ui/dashboard/users/breadcrumbs";

export default async function GuardsPage() {
  // <div>(Página) Gestionar guardias - [SSR]</div>
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[{ label: "Guardias", href: "/dashboard/guards" }]}
      />
      <h2 className="text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        Gestión de Guardias
      </h2>
      <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        Administrar guardias en el sistema
      </p>
      <GuardsTable />
      {/* <GuardsForm /> */}
    </section>
  );
}
