import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import Timeline from "@/app/ui/timeline";
import ChecklistQuestionsForm from "@/app/ui/checklists/ambulances/edit/checklist-questions-form";
import NotesSignatureForm from "@/app/ui/checklists/ambulances/edit/notes-signature-form";
import {
  fetchChecklistQuestions,
  fetchChecklistSteps,
} from "@/app/lib/data/checklist";
import { fetchUsers } from "@/app/lib/data/users";
import { CustomOptions } from "@/app/lib/definitions";

export const metadata: Metadata = {
  title: "Área de Chequeo de Ambulancia",
};

export default async function EditCheckListAmbulancePage({
  params,
  searchParams,
}: {
  params: Promise<{ guardId: string; id: string }>;
  searchParams: Promise<{
    step: string | undefined;
    notes: string | undefined;
  }>;
}) {
  // (Página) Editar el CheckList de Ambulancia - [SSR]

  const { guardId, id } = await params;
  const { step, notes } = await searchParams;
  const param = Number(step) || undefined;

  const data = !notes ? await fetchChecklistQuestions(param) : [];

  if (!notes && (!Number(step) || !data.length)) {
    notFound();
  }

  const [[steps, maxSteps], users] = await Promise.all([
    fetchChecklistSteps(),
    fetchUsers(),
  ]);
  const isLastQuestions = Number(step) >= maxSteps;

  const tmProgress = (Number(step) / maxSteps) * 100;

  const currentStep = steps.find(({ id }) => id === Number(step));
  if (currentStep) {
    currentStep.status = "pending";
  }
  const title = currentStep?.label;
  const customUsers = users.map<
    CustomOptions & {
      position?: string;
    }
  >(({ id, name, lastname, position }) => ({
    id,
    label: `${name} ${lastname}`,
    value: id,
    position,
  }));

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
          {
            label: "Checklist",
            href: `/checklists/${guardId}/ambulances/${id}/edit?step=${step}`,
            active: false,
          },
        ]}
      />
      <section className="md:space-y-0 p-4">
        {isLastQuestions && notes ? (
          <NotesSignatureForm
            title={"Notas"}
            data={data}
            usersOptions={customUsers}
          >
            <Timeline
              key={"tm-progress-" + tmProgress}
              steps={steps}
              currentStepId={Number(step)}
              progress={tmProgress}
              showStatus
            />
          </NotesSignatureForm>
        ) : (
          <ChecklistQuestionsForm
            data={data}
            isLastQuestions={isLastQuestions}
            title={title}
          >
            <Timeline
              key={"tm-progress-" + tmProgress}
              steps={steps}
              currentStepId={Number(step)}
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
