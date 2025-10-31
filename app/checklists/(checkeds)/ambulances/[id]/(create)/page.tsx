import { Suspense } from "react";
import { Metadata } from "next";
import { fetchCheckListAmbulanceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { FormSkeleton } from "@/app/ui/dashboard/skeletons";
import ChecklistAmbulanceForm from "@/app/ui/checklists/ambulances/create/checklist-ambulance-form";

export const metadata: Metadata = {
  title: "Chequeo de Ambulancia",
};

export default async function CheckListAmbulancePage(props: {
  params: Promise<{ id: string }>;
}) {
  // (Página) CheckList de Ambulancia - [SSR]

  const params = await props.params;
  const id = params.id;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          { label: "Checklists", href: "/checklists" },
          {
            label: "Chequeo de Ambulancia",
            href: `/checklists/ambulances/${id}`,
            active: true,
          },
        ]}
      />
      {/* TODO: prepara un sketelo apropiado para formulario de checklist */}
      <Suspense fallback={<FormSkeleton goBackUrl="/ckecklists" />}>
        <WrapperForm
          fetchData={async () => await fetchCheckListAmbulanceById(id)}
          WrappedComponent={ChecklistAmbulanceForm}
        />
      </Suspense>
    </div>
  );
}
