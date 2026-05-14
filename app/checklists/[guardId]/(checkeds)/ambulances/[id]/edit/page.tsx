import { Suspense } from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CustomOptions } from "@/app/lib/definitions";
import { getSession } from "@/app/lib/dal";
import { fetchDelegationMembers } from "@/app/lib/data/delegations";
import {
  fetchChecklistQuestions,
  fetchChecklistSteps,
} from "@/app/lib/data/checklist";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import Timeline from "@/app/ui/timeline";
import ChecklistQuestionsForm from "@/app/ui/checklists/ambulances/edit/checklist-questions-form";
import ChecklistAmbulanceSign from "@/app/ui/checklists/ambulances/edit/notes-signature-form";
import {
  ChecklistNotesSkeleton,
  ChecklistQuestionsSkeleton,
} from "@/app/ui/components/skeletons";

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

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 pt-0">
      <Breadcrumbs
        breadcrumbs={[
          { label: "", href: "/" },
          {
            label: "Chequeo de Ambulancia",
            href: `/checklists/${guardId}/ambulances/${id}/create`,
          },
          {
            label: "Checklist",
            href: `/checklists/${guardId}/ambulances/${id}/edit?step=${step}`,
            active: true,
          },
        ]}
      />
      <Suspense
        fallback={
          notes ? <ChecklistNotesSkeleton /> : <ChecklistQuestionsSkeleton />
        }
      >
        <ChecklistAmbulanceEditor step={step} notes={notes} />
      </Suspense>
    </section>
  );
}

async function ChecklistAmbulanceEditor({
  step,
  notes,
}: {
  step?: string;
  notes?: string;
}) {
  const param = Number(step) || undefined;

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const authorizedUser = session.user;

  const data = !notes
    ? await fetchChecklistQuestions(param).then((res) => res.data)
    : [];

  if (!notes && (!Number(step) || !data.length)) {
    notFound();
  }

  const [[steps, maxSteps], users] = await Promise.all([
    fetchChecklistSteps(),
    fetchDelegationMembers(authorizedUser.delegationId).then((res) => res.data),
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
      email?: string;
    }
  >(({ id, name, lastname, position, email }) => ({
    id,
    label: `${name} ${lastname}`,
    value: id,
    email: email,
    position,
  }));

  return (
    <section className="md:space-y-0 p-4">
      {isLastQuestions && notes ? (
        <ChecklistAmbulanceSign title={"Notas"} usersOptions={customUsers}>
          <Timeline
            key={"tm-progress-" + tmProgress}
            steps={steps}
            currentStepId={Number(step)}
            progress={tmProgress}
            showStatus
          />
        </ChecklistAmbulanceSign>
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
  );
}
