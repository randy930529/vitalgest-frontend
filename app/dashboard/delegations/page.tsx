import DelegationTable from "@/app/ui/dashboard/delegations/delegation-table";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function Page() {
  // <div>(Página) Gestionar delegaciones - [SSR]</div>

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Delegaciones", href: "/dashboard/delegations" },
        ]}
      />
      <DelegationTable />
    </>
  );
}
