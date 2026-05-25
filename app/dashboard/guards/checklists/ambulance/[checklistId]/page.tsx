import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchChecklistAmbulance } from "@/app/lib/data/checklist";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Inspección de Ambulancia",
};

export default async function ChecklistAmbulancePage({
  params,
  searchParams,
}: {
  params: Promise<{ checklistId: string }>;
  searchParams: Promise<{ delegation: string }>;
}) {
  const { checklistId } = await params;
  const { delegation } = await searchParams;
  const checklist = await fetchChecklistAmbulance(checklistId);

  if (!checklist) {
    notFound();
  }

  return (
    <div>
      <h1>Reporte de Inspección de Ambulancia {delegation}</h1>
      <p>En DESARROLLO</p>
      <div className="no-print max-w-[900px] mx-auto mb-6 flex justify-between items-center">
        <Link
          href={`/dashboard/guards`}
          className="px-3 py-2 rounded-lg bg-white border border-gray-300 flex items-center gap-2 text-gray-700 font-semibold shadow-sm transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Volver a la Guardia
        </Link>
      </div>
    </div>
  );
}
