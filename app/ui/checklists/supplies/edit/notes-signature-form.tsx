"use client";

import { useParams, useRouter } from "next/navigation";
import {
  AnswersChecklistSupplyType,
  CustomOptions,
} from "@/app/lib/definitions";
import { useChecklistSupplyStore } from "@/app/lib/store/checklist-answers";
import {
  signCheckListSupply,
  updateCheckListSupplyAnswers,
} from "@/app/lib/actions/checklist";
import NotesSignatureForm from "@/app/ui/components/NotesSignatureForm";

export default function ChecklistSupplySign({
  children,
  title,
  usersOptions,
}: {
  children?: React.ReactNode;
  title?: string;
  usersOptions: (CustomOptions & {
    position?: string;
    email?: string;
  })[];
}) {
  const router = useRouter();
  const { id } = useParams<{ guardId: string; id: string }>();
  const { answers, reset } = useChecklistSupplyStore();

  const prepareAnswers = () => {
    const allAnswers: AnswersChecklistSupplyType[] = [];
    Object.values(answers).forEach((stepAnswers) => {
      allAnswers.push(...stepAnswers);
    });
    return allAnswers;
  };

  const updateCheckListAnswersWithId = updateCheckListSupplyAnswers.bind(
    null,
    id || "",
  );
  const signCheckListWithId = signCheckListSupply.bind(null, id || "");

  return (
    <NotesSignatureForm
      children={children}
      title={title}
      usersOptions={usersOptions}
      prepareAnswers={prepareAnswers}
      updateAction={updateCheckListAnswersWithId}
      signAction={signCheckListWithId}
      onUpdateSuccess={reset}
      onSignSuccess={() => router.push("/")}
      link="supplies"
    />
  );
}
