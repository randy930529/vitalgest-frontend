"use client";

import {
  QuestionCategoryType,
  QuestionSubcategoryType,
} from "@/app/lib/definitions";
import { createQuestion } from "@/app/lib/actions/question";
import { useActionState, useMemo, useState } from "react";
import { useFormNotifications } from "@/app/lib/hooks/useFormNotifications";
import { FormButtons } from "@/app/ui/button";
import { CHECKLIST_RESPONSE_TYPES } from "@/app/lib/config/constants";
import { FormInput, FormSelect } from "@/app/ui/dashboard/form-fields";

export default function QuestionForm({
  categories = [],
  subcategories = [],
  onClose,
}: {
  categories?: QuestionCategoryType[];
  subcategories?: QuestionSubcategoryType[];
  onClose?: () => void;
}) {
  // (Component) Formulario de Pregunta de Checklist - [CSR]

  const [categoryId, setCategoryId] = useState("");
  const [state, formAction, isLoading] = useActionState(createQuestion, {
    errors: {},
    message: null,
  });
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

  useFormNotifications({ state, onClose });

  return (
    <form action={formAction}>
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        <FormInput name="question" customFormInput={{ question: {
          type: "text", title: "Pregunta", required: true,
        } }} errors={state.errors?.question} />
        <FormSelect name="categoryId" title="Categoría" required
          options={categories.map((category) => ({ id: category.id, value: category.id, label: category.name }))}
          errors={state.errors?.categoryId}
          handleOption={(_, value) => setCategoryId(value)} />
        <FormSelect name="subcategoryId" title="Subcategoría"
          options={subcategoryOptions} errors={state.errors?.subcategoryId} />
        <FormSelect name="typeResponse" title="Tipo de respuesta" required
          options={Object.entries(CHECKLIST_RESPONSE_TYPES).map(([value, label], index) => ({ id: index, value, label }))}
          errors={state.errors?.typeResponse} />
      </div>
      <FormButtons onCancel={onClose} isLoading={isLoading} />
    </form>
  );
}
