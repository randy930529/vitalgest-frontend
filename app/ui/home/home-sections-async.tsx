import { UserType } from "@/app/lib/definitions";
import { closeGuard } from "@/app/lib/actions/guard";
import { fetchGuardsAndInlineGuardByUserMe } from "@/app/lib/data/guards";
import { GuardStats } from "@/app/ui/home/stast-home";
import GuardsTableSection from "@/app/ui/home/guards-table-section";
import { EmptyStateCard } from "@/app/ui/state-feedback";

export async function CurrentGuardSection({ user }: { user: UserType }) {
  const [, inlineGuard] = await fetchGuardsAndInlineGuardByUserMe(user);

  if (inlineGuard?.shifts) {
    const isGuardCompleted = inlineGuard.shifts.every(
      ({ checklistAmbulance, checklistSupplies }) =>
        checklistAmbulance?.recipient_id && checklistSupplies?.recipient_id,
    );

    if (isGuardCompleted) {
      inlineGuard.state = "Cerrada";
      await closeGuard(inlineGuard.id, inlineGuard);
    }
  }

  return (
    <section
      aria-labelledby="guardia-curso-title"
      className="rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] sm:p-6"
    >
      <header className="mb-5 space-y-2">
        <h2
          id="guardia-curso-title"
          className="text-xl font-bold text-slate-900 sm:text-2xl"
        >
          Guardia en curso y checklist
        </h2>
        <p className="text-sm text-slate-600 sm:text-base">
          Centraliza el estado de la guardia actual y ejecuta los checklist para
          cerrarla.
        </p>
      </header>

      {inlineGuard ? (
        <GuardStats guard={inlineGuard} />
      ) : (
        <EmptyStateCard
          title="No tienes una guardia en curso."
          description="Crea una nueva guardia para habilitar el seguimiento de turnos y el avance de checklist de ambulancia e insumos."
          actionLabel="Crear guardia"
          actionHref="/dashboard/guards"
        />
      )}
    </section>
  );
}

export async function GuardHistorySection({ user }: { user: UserType }) {
  const isClient =
    user.role === "paramedical" || user.role === "vehicle_operator";

  return (
    <section aria-labelledby="historial-guardias-title">
      <GuardsTableSection user={user} isClient={isClient} />
    </section>
  );
}
