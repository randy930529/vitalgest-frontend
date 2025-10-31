import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchChecklistQuestions, fetchChecklistSteps } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import Timeline from "@/app/ui/timeline";
import ChecklistQuestionsForm from "@/app/ui/checklists/ambulances/edit/checklist-questions-form";
import NotesSignatureForm from "@/app/ui/checklists/ambulances/edit/notes-signature-form";

export const metadata: Metadata = {
  title: "Área de Chequeo de Ambulancia",
};

export default async function EditCheckListAmbulancePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    step: string | undefined;
    notes: string | undefined;
  }>;
}) {
  // (Página) Editar el CheckList de Ambulancia - [SSR]

  const { id } = await params;
  const { step, notes } = await searchParams;
  console.log(id, step, notes);
  const param = Number(step) || undefined;

  const data = !notes ? await fetchChecklistQuestions(param) : [];

  if (!notes && (!Number(step) || !data.length)) {
    notFound();
  }

  const [steps, maxSteps] = await fetchChecklistSteps();
  const isLastQuestions = Number(step) >= maxSteps;

  const tmProgress = (Number(step) / maxSteps) * 100;

  const currentStep = steps.find(({ id }) => id === Number(step));
  if (currentStep) {
    currentStep.status = "pending";
  }
  const title = currentStep?.label;

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
          {
            label: "Checklist",
            href: `/checklists/ambulances/${id}/edit?step=${step}`,
            active: true,
          },
        ]}
      />
      <section className="md:space-y-0 p-4">
        {isLastQuestions && notes ? (
          <NotesSignatureForm title={"Notas"}>
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
