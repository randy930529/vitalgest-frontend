import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import ChecklistSuppliesForm from "@/app/ui/checklists/supplies/create/checklist-supplies-form";
import { fetchShiftById } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Chequeo de Insumos",
};

export default async function CheckListSuppliesPage({
  params,
}: {
  params: Promise<{ guardId: string; id: string }>;
}) {
  // (Página) CheckList de Ambulancia - [SSR]

  const { id, guardId } = await params;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          {
            label: "Chequeo de Ambulancia",
            href: `/checklists/${guardId}/supplies/${id}/create`,
            active: true,
          },
        ]}
      />
      {/* TODO: prepara un sketelo apropiado para formulario de checklist */}
      <Suspense fallback={<FormSkeleton goBackUrl="/ckecklists" />}>
        <WrapperForm
          fetchData={async () => await fetchShiftById(id)}
          WrappedComponent={ChecklistSuppliesForm}
        />
      </Suspense>
    </div>
  );
}
