import Link from "next/link";
import { fetchOpenGuardsByUserMe } from "@/app/lib/data";
import { GuardsStats } from "../dashboard/stats-cards";

export default async function MainContainer() {
  const guards = await fetchOpenGuardsByUserMe();
  return (
    <main className="mt-4 flex grow flex-col gap-4 md:flex-row">
      <GuardsStats />
      {guards.map(({ id }) => (
        <Link
          key={`checklists-${id}`}
          href={`/checklists/${id}`}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          CheckList Ambulancia
        </Link>
      ))}
    </main>
  );
}
