import Breadcrumbs from "@/app/ui/breadcrumbs";

export default function MaintenancePage() {
  return (
    <section className="vital-shell">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/dashboard" },
          {
            label: "Mantenimiento",
            href: "/dashboard/maintenance",
            active: true,
          },
        ]}
      />

      <main className="relative mt-7 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-slate-900">Mantenimiento</h2>
        <p className="mt-2 text-sm text-slate-600">
          Modulo en preparacion. Aqui se mostraran actividades y bitacoras de
          mantenimiento.
        </p>
      </main>
    </section>
  );
}
