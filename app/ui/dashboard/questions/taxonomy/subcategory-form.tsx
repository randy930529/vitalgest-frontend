"use client";

import { createQuestionSubcategory } from "@/app/lib/actions/question-taxonomy";
import { QuestionCategoryType } from "@/app/lib/definitions";
import { GenericForm } from "@/app/ui/components/generic-form";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";

export function SubcategoryForm({
  categories,
  categoryId,
  onClose,
}: {
  categories: QuestionCategoryType[];
  categoryId?: string;
  onClose?: () => void;
}) {
  // (Component) Formulario de subcategorías - [CSR]

  const fields = getFormConfigFields("subcategory", [
    {
      name: "categoryId",
      type: "select",
      title: "Categoría",
      required: true,
      options: categories.map((category) => ({
        id: category.id,
        value: category.id,
        label: category.name,
      })),
      defaultValue: categoryId || "",
    },
  ]);

  return (
    <GenericForm
      fields={fields}
      onSubmit={createQuestionSubcategory}
      initialState={{ errors: {}, message: null }}
      onCancel={onClose}
    />
  );
}
