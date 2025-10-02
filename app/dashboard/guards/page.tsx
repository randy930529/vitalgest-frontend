import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function GuardsPage() {
  // <div>(Página) Gestionar guardias - [SSR]</div>
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Guardias", href: "/dashboard/guards" },
        ]}
      />
      <GuardsTable />
      {/* <GuardsForm /> */}
    </>
  );
}
