import Link from "next/link";
import { UserType } from "@/app/lib/definitions";
import { fetchGuardsAndInlineGuardByUserMe } from "@/app/lib/data/guards";
import { GuardStats } from "@/app/ui/home/stast-home";

export default async function MainContainer({ user }: { user: UserType }) {
  const [guards, inlineGuard] = await fetchGuardsAndInlineGuardByUserMe(user);
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

      {/* {guards.map(({ id }) => (
        <Link
          key={`checklists-${id}`}
          href={`/checklists/${id}`}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          CheckList Ambulancia
        </Link>
      ))} */}
    </main>
  );
}
