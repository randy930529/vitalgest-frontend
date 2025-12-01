import { UserType } from "@/app/lib/definitions";
import { fetchGuardsAndInlineGuardByUserMe } from "@/app/lib/data/guards";
import { closeGuard } from "@/app/lib/actions/guard";
import { GuardStats } from "@/app/ui/home/stast-home";
import GuardsTableSection from "@/app/ui/home/guards-table-section";

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

  const isClient =
    user.role === "paramedical" || user.role === "vehicle_operator";

  return (
    <main className="flex flex-col gap-4 my-4 p-8">
      <div className="flex grow flex-col gap-4 md:flex-row">
        {inlineGuard && <GuardStats guard={inlineGuard} />}
      </div>
      <GuardsTableSection guards={guards} isClient={isClient} />
    </main>
  );
}
