"use client";

import { useMemo, useState } from "react";
import {
  QuestionCategoryType,
  QuestionSubcategoryType,
} from "@/app/lib/definitions";
import { createQuestion } from "@/app/lib/actions/question";
import { QuestionState } from "@/app/lib/config/stateConfigs";
import { getFormConfigFields } from "@/app/lib/config/formConfigs";
import { FormSelect } from "@/app/ui/dashboard/form-fields";
import { GenericForm } from "@/app/ui/components/generic-form";
import StepContent from "@/app/ui/components/step-content";
import { CategoryForm } from "@/app/ui/dashboard/questions/taxonomy/category-form";
import { SubcategoryForm } from "@/app/ui/dashboard/questions/taxonomy/subcategory-form";

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

  const initialState: QuestionState = { errors: {}, message: null };
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);

  const fields = getFormConfigFields("question", [
    {
      type: "custom",
      name: "taxonomy",
      component: CustomFiles({
        categories,
        subcategories,
        state: initialState,
        setShowCategoryForm,
        setShowSubcategoryForm,
      }),
    },
  ]);

  return (
    <>
      {showCategoryForm && (
        <StepContent isStepContentVisible={showCategoryForm}>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-white">
            Crear Categoría
          </h3>
          <CategoryForm onClose={() => setShowCategoryForm(false)} />
        </StepContent>
      )}
      {showSubcategoryForm && (
        <StepContent isStepContentVisible={showSubcategoryForm}>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-white">
            Crear Subcategoría
          </h3>
          <SubcategoryForm
            categories={categories}
            onClose={() => setShowSubcategoryForm(false)}
          />
        </StepContent>
      )}

      <GenericForm
        fields={fields}
        onSubmit={createQuestion}
        initialState={initialState}
        onCancel={onClose}
      />
    </>
  );
}

function CustomFiles({
  categories = [],
  subcategories = [],
  state,
  setShowCategoryForm,
  setShowSubcategoryForm,
}: {
  categories?: QuestionCategoryType[];
  subcategories?: QuestionSubcategoryType[];
  state: QuestionState;
  setShowCategoryForm?: (show: boolean) => void;
  setShowSubcategoryForm?: (show: boolean) => void;
}) {
  const [categoryId, setCategoryId] = useState("");
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

  return (
    <>
      <FormSelect
        name="categoryId"
        title="Categoría"
        required
        options={categories.map((category) => ({
          id: category.id,
          value: category.id,
          label: category.name,
        }))}
        errors={state.errors?.categoryId}
        handleOption={(_, value) => setCategoryId(value)}
        handlePin={() => {
          setShowSubcategoryForm?.(false);
          setShowCategoryForm?.(true);
        }}
        titlePin="Crear Categoría"
      />
      <FormSelect
        name="subcategoryId"
        title="Subcategoría"
        options={subcategoryOptions}
        errors={state.errors?.subcategoryId}
        handlePin={() => {
          setShowCategoryForm?.(false);
          setShowSubcategoryForm?.(true);
        }}
        titlePin="Crear Subcategoría"
      />
    </>
  );
}
