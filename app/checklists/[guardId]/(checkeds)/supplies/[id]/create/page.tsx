import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { ChecklistCreateSkeleton } from "@/app/ui/components/skeletons";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import ChecklistSuppliesForm from "@/app/ui/checklists/supplies/create/checklist-supplies-form";
import { fetchShiftById } from "@/app/lib/data/shifts";

export const metadata: Metadata = {
  title: "Chequeo de Insumos",
};

export default async function CheckListSuppliesPage({
  params,
}: {
  params: Promise<{ guardId: string; id: string }>;
}) {
  // (Página) CheckList de Insumos - [SSR]

  const { id, guardId } = await params;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          {
            label: "Chequeo de Insumos",
            href: `/checklists/${guardId}/supplies/${id}/create`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<ChecklistCreateSkeleton />}>
        <WrapperForm
          fetchData={async () => await fetchShiftById(id)}
          WrappedComponent={ChecklistSuppliesForm}
        />
      </Suspense>
    </div>
  );
}
