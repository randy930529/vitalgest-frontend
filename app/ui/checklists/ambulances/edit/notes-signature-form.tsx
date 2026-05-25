"use client";

import { useParams, useRouter } from "next/navigation";
import { CustomOptions } from "@/app/lib/definitions";
import { purgeDuplicateAnswers } from "@/app/lib/utils";
import { useChecklistAmbulanceStore } from "@/app/lib/store/checklist-answers";
import {
  signCheckListAmbulance,
  updateCheckListAmbulanceAnswers,
} from "@/app/lib/actions/checklist";
import NotesSignatureForm from "@/app/ui/components/NotesSignatureForm";

export default function ChecklistAmbulanceSign({
  children,
  title,
  usersOptions,
}: {
  children?: React.ReactNode;
  title?: string;
  usersOptions: (CustomOptions & {
    position?: string;
    email?: string;
    role?: string;
  })[];
}) {
  const router = useRouter();
  const { id } = useParams<{ guardId: string; id: string }>();
  const { answers, reset } = useChecklistAmbulanceStore();

  const prepareAnswers = () => purgeDuplicateAnswers(answers);
  const updateCheckListAmbulanceAnswersWithId =
    updateCheckListAmbulanceAnswers.bind(null, id || "");
  const signCheckListAmbulanceWithId = signCheckListAmbulance.bind(
    null,
    id || "",
  );

  return (
    <NotesSignatureForm
      children={children}
      title={title}
      usersOptions={usersOptions}
      prepareAnswers={prepareAnswers}
      updateAction={updateCheckListAmbulanceAnswersWithId}
      signAction={signCheckListAmbulanceWithId}
      onUpdateSuccess={reset}
      onSignSuccess={() => router.push("/")}
      link="ambulances"
    />
  );
}
