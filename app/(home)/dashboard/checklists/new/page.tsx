import Breadcrumbs from "@/app/ui/breadcrumbs";
import ShiftChangeForm from "@/app/ui/dashboard/checklists/new/shift-shange-form";

export default async function Page() {
  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          { label: "Checklists", href: "/dashboard/checklists" },
          {
            label: "Nuevo cambio de guardia",
            href: "/dashboard/checklists/new",
            active: true,
          },
        ]}
      />
      <ShiftChangeForm />
    </section>
  );
}
