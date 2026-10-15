"use client";

import { notFound, useRouter } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  ChecklistQuestionsType,
  QuestionCategoryType,
  QuestionSubcategoryType,
} from "@/app/lib/definitions";
import { QuestionState } from "@/app/lib/config/stateConfigs";
import { updateQuestion } from "@/app/lib/actions/question";
import { useActionState, useMemo, useState } from "react";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { FormButtons } from "@/app/ui/button";
import { FormInput, FormSelect } from "@/app/ui/dashboard/form-fields";
import { CHECKLIST_RESPONSE_TYPES } from "@/app/lib/config/constants";

export default function QuestionEditForm({
  data,
}: {
  data: [
    ChecklistQuestionsType | undefined,
    QuestionCategoryType[],
    QuestionSubcategoryType[],
  ];
}) {
  // (Component) Formulario de preguntas - [CSR]

  const router = useRouter();
  const [question, categories, subcategories] = data;

  if (!question) {
    notFound();
  }

  const initialState: QuestionState = { errors: {}, message: null };
  const updateQuestionWithId = updateQuestion.bind(null, question?.id || "");
  const [categoryId, setCategoryId] = useState(question.category_id);
  const [state, formAction, isLoading] = useActionState(
    updateQuestionWithId,
    initialState,
  );
  const subcategoryOptions = useMemo(
    () => [
      { id: "", value: "", label: "Sin subcategoría" },
      ...subcategories
        .filter((subcategory) => subcategory.category_id === categoryId)
        .map((subcategory) => ({
          id: subcategory.id,
          value: subcategory.id,
          label: subcategory.name,
        })),
    ],
    [categoryId, subcategories],
  );

  useFormNotifications({
    state,
    onClose: () => router.push("/dashboard/questions"),
  });

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
        <form action={formAction} className="w-full">
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <FormInput name="question" customFormInput={{ question: {
              type: "text", title: "Pregunta", required: true,
            } }} initialValue={question.question} errors={state.errors?.question} />
            <FormSelect name="categoryId" title="Categoría" required
              options={categories.map((category) => ({ id: category.id, value: category.id, label: category.name }))}
              defaultValue={categoryId} errors={state.errors?.categoryId}
              handleOption={(_, value) => setCategoryId(value)} />
            <FormSelect name="subcategoryId" title="Subcategoría"
              options={subcategoryOptions} defaultValue={question.subcategory_id || ""}
              errors={state.errors?.subcategoryId} />
            <FormSelect name="typeResponse" title="Tipo de respuesta" required
              options={Object.entries(CHECKLIST_RESPONSE_TYPES).map(([value, label], index) => ({ id: index, value, label }))}
              defaultValue={question.type_response} errors={state.errors?.typeResponse} />
            <FormInput name="order" customFormInput={{ order: {
              type: "number", title: "Orden", required: true,
            } }} initialValue={String(question.order_question_category)}
              errors={state.errors?.order} />
          </div>
          <FormButtons onCancel={() => router.push("/dashboard/questions")} isLoading={isLoading} />
        </form>
      </div>
    </main>
  );
}
