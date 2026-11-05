import Breadcrumbs from "@/app/ui/breadcrumbs";
import ShiftChangeTable from "@/app/ui/dashboard/checklists/shift-change-table";

export default async function Page() {
  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Checklists", href: "/dashboard/checklists", active: true },
        ]}
      />
      <ShiftChangeTable />
    </section>
  );
}
