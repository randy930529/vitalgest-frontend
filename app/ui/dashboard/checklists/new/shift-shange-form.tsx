export default async function ShiftChangeForm() {
  return (
    <main className="space-y-4">
      <section className="relative mt-4 overflow-hidden rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Formulario de cambio de guardia
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Registra los datos principales del turno y continua con los
          checklists.
        </p>
      </section>
      <AmbulanceChecklist />
      <SuppliesChecklist />
    </main>
  );
}

export function AmbulanceChecklist() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Checklist de ambulancia
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Seccion para validaciones de unidad durante el cambio de guardia.
      </p>
    </section>
  );
}

export function SuppliesChecklist() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Checklist de insumos
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Seccion para control de disponibilidad y estado de insumos.
      </p>
    </section>
  );
}
