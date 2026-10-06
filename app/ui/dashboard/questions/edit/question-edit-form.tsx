"use client";

import { notFound, useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ChecklistQuestionsType, DelegationType } from "@/app/lib/definitions";
import { QuestionState } from "@/app/lib/config/stateConfigs";
import { updateQuestion } from "@/app/lib/actions/question";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { getCustomDelegations } from "@/app/lib/utils";
import { GenericForm } from "@/app/ui/components/generic-form";

export default function QuestionEditForm({
  data,
}: {
  data: [ChecklistQuestionsType | undefined, DelegationType[]];
}) {
  // (Component) Formulario de preguntas - [CSR]

  const router = useRouter();
  const [question, delegations] = data;

  if (!question) {
    notFound();
  }

  const validFieldTypes = [
    "text",
    "email",
    "password",
    "number",
    "select",
    "date",
  ];
  const customFormInput = getFormConfigFields("question", [
    {
      type: "select",
      name: "delegation",
      title: "Delegación",
      options: getCustomDelegations(delegations),
      required: true,
    },
  ]).map((field) => {
    if (validFieldTypes.includes(field.type)) {
      return {
        ...field,
        defaultValue: String(
          question[field.name as keyof ChecklistQuestionsType] ?? "",
        ),
      };
    }

    return field;
  });

  const initialState: QuestionState = { errors: {}, message: null };
  const updateQuestionWithId = updateQuestion.bind(null, question?.id || "");

  return (
    <main className="bg-white mt-7 dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <h2 className="flex gap-2 items-center ms-6 text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
        <PencilSquareIcon className="w-6 h-6" />
        {question.question}
      </h2>
      <p className="ms-6 font-semibold text-gray-500 dark:text-gray-400 text-center md:text-left">
        {question.name_category.toUpperCase()}
      </p>
      <div className="flex md:flex-row items-center justify-center md:space-y-0 p-4">
        <GenericForm
          fields={customFormInput}
          onSubmit={updateQuestionWithId}
          initialState={initialState}
          onCancel={() => router.push("/dashboard/questions")}
        />
      </div>
    </main>
  );
}
