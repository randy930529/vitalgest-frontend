import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomOptions } from "@/app/lib/definitions";
import {
  fetchAmbulanceAreasSteps,
  fetchChecklistSuppliesQuestions,
} from "@/app/lib/data/checklist";
import { fetchUsers } from "@/app/lib/data/users";
import Timeline from "@/app/ui/timeline";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ChecklistSupplySign from "@/app/ui/checklists/supplies/edit/notes-signature-form";
import ChecklistQuestionsForm from "@/app/ui/checklists/supplies/edit/checklist-questions-form";

export const metadata: Metadata = {
  title: "Área de Chequeo de Insumos",
};

export default async function EditCheckListInsumosPage({
  params,
  searchParams,
}: {
  params: Promise<{ guardId: string; id: string }>;
  searchParams: Promise<{
    ambulance: string | undefined;
    step: string | undefined;
    notes: string | undefined;
  }>;
}) {
  // (Página) Editar el CheckList de Insumos - [SSR]

  const { guardId, id } = await params;
  const { ambulance, step, notes } = await searchParams;
  const areaId = Number(step) || 0;

  const data = !notes
    ? await fetchChecklistSuppliesQuestions(ambulance || "", areaId)
    : [];

  if (!notes && !areaId) {
    notFound();
  }

  const [[steps, maxSteps], users] = await Promise.all([
    fetchAmbulanceAreasSteps(),
    fetchUsers().then((res) => res.data),
  ]);
  const isLastQuestions = areaId >= maxSteps;

  const tmProgress = (areaId / maxSteps) * 100;

  const currentStep = steps.find(({ id }) => id === areaId);
  if (currentStep) {
    currentStep.status = "pending";
  }
  const title = currentStep?.label;
  const customUsers = users.map<
    CustomOptions & {
      position?: string;
      email?: string;
    }
  >(({ id, name, lastname, position, email }) => ({
    id,
    label: `${name} ${lastname}`,
    value: id,
    position,
    email,
  }));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          {
            label: "Chequeo de Ambulancia",
            href: `/checklists/${guardId}/supplies/${id}/create`,
          },
          {
            label: "Checklist",
            href: `/checklists/${guardId}/supplies/${id}/edit?step=${step}`,
            active: true,
          },
        ]}
      />
      <section className="md:space-y-0 p-4">
        {isLastQuestions && notes ? (
          <ChecklistSupplySign title={"Notas"} usersOptions={customUsers}>
            <Timeline
              key={"tm-progress-" + tmProgress}
              steps={steps}
              currentStepId={areaId}
              progress={tmProgress}
              showStatus
            />
          </ChecklistSupplySign>
        ) : (
          <ChecklistQuestionsForm
            data={data}
            isLastQuestions={isLastQuestions}
            title={title}
          >
            <Timeline
              key={"tm-progress-" + tmProgress}
              steps={steps}
              currentStepId={areaId}
              progress={tmProgress}
            />
          </ChecklistQuestionsForm>
        )}
      </section>
      {/* <Suspense fallback={<FormSkeleton goBackUrl="/checklists" />}>
        <WrapperForm
          fetchData={async () => {}}
          WrappedComponent={EditChecklistAmbulanceForm}
        />
      </Suspense> */}
    </div>
  );
}
