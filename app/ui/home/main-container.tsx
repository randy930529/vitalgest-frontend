import { UserType } from "@/app/lib/definitions";
import { fetchGuardsAndInlineGuardByUserMe } from "@/app/lib/data/guards";
import { GuardStats } from "@/app/ui/home/stast-home";
import { closeGuard } from "@/app/lib/actions/guard";

export default async function MainContainer({ user }: { user: UserType }) {
  const [guards, inlineGuard] = await fetchGuardsAndInlineGuardByUserMe(user);

  if (inlineGuard?.shifts) {
    const isGuardCompleted = inlineGuard.shifts.every(
      ({ checklistAmbulance, checklistSupplies }) =>
        checklistAmbulance?.recipient_id && checklistSupplies?.recipient_id
    );
    if (isGuardCompleted) {
      inlineGuard.state = "Cerrada";
      await closeGuard(inlineGuard.id, inlineGuard);
    }
  }

  return (
    <main className="my-4 p-8 flex grow flex-col gap-4 md:flex-row">
      {inlineGuard && <GuardStats guard={inlineGuard} />}

      {/* TODO: Una seccion que muestra todas las guardias realizadas por el 
      usuario logueado.
      - Inicial muestra una cantidad reducida y una opcion para ver el todas
      las guardias realizadas.
      - Siguiente las guardias se agrupan/paginan por mes y año.
      __2025___________
      _________________
      ___________Enero_
      -----------------
      -----------------
      -----------------
       */}
    </main>
  );
}
