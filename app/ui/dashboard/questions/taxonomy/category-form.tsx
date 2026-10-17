"use client";

import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { GenericForm } from "@/app/ui/components/generic-form";
import { createQuestionCategory } from "@/app/lib/actions/question-taxonomy";

export function CategoryForm({ onClose }: { onClose?: () => void }) {
  // (Component) Formulario de categorías - [CSR]

  const fields = getFormConfigFields("category");

  return (
    <GenericForm
      fields={fields}
      onSubmit={createQuestionCategory}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
