import Link from "next/link";
import { fetchShiftsByGuardId } from "@/app/lib/data";

export default async function CheckListsPage(props: {
  params: Promise<{ guardId: string }>;
}) {
  // (Página) Listado de listas de chequeo - [SSR]

  const params = await props.params;
  const guardId = params.guardId;
  const shifts = await fetchShiftsByGuardId(guardId);

  return (
    <div className="flex flex-col">
      <h2>Turnos</h2>
      {shifts.map(({ id }) => (
        <Link
          key={`shift-${id}`}
          className="m-6 font-medium text-blue-600 dark:text-blue-500 hover:underline"
          href={`/checklists/${guardId}/ambulances/${id}/create`}
        >
          CheckList Ambulancia
        </Link>
      ))}
      <Link
        className="m-6 font-medium text-blue-600 dark:text-blue-500 hover:underline"
        href="/checklists/supplies/234234-234234"
      >
        CheckList Insumos
      </Link>
    </div>
  );
}
