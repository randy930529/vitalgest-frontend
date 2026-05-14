import { Suspense } from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { WrapperForm } from "@/app/ui/dashboard/wrappers";
import { ChecklistCreateSkeleton } from "@/app/ui/components/skeletons";
import ChecklistAmbulanceForm from "@/app/ui/checklists/ambulances/create/checklist-ambulance-form";
import { fetchShiftById } from "@/app/lib/data/shifts";

export const metadata: Metadata = {
  title: "Chequeo de Ambulancia",
};

export default async function CheckListAmbulancePage(props: {
  params: Promise<{ guardId: string; id: string }>;
}) {
  // (Página) CheckList de Ambulancia - [SSR]

  const params = await props.params;
  const id = params.id;
  const guardId = params.guardId;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          {
            label: "Chequeo de Ambulancia",
            href: `/checklists/${guardId}/ambulances/${id}/create`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<ChecklistCreateSkeleton />}>
        <WrapperForm
          fetchData={async () => await fetchShiftById(id)}
          WrappedComponent={ChecklistAmbulanceForm}
        />
      </Suspense>
    </div>
  );
}
