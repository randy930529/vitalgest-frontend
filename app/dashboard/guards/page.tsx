import { Metadata } from "next";
import GuardsTable from "@/app/ui/dashboard/guards/guards-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Gestión de Guardias",
};

export default async function GuardsPage() {
  // (Página) Gestionar guardias - [SSR]

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Guardias", href: "/dashboard/guards" },
        ]}
      />
      <GuardsTable />
    </>
  );
}
