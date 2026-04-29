"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChecklistQuestionsType } from "@/app/lib/definitions";
import { createPageURL, createStepAnswers } from "@/app/lib/utils";
import { useChecklistAmbulanceStore } from "@/app/lib/store/checklist-answers";
import { FormInputSetter } from "@/app/ui/dashboard/form-fields";
import { PaginationChecklist } from "@/app/ui/components/pagination";

export default function ChecklistQuestionsForm({
  children,
  data: checklistQuestions,
  isLastQuestions,
  title,
}: {
  children?: React.ReactNode;
  data: ChecklistQuestionsType[];
  isLastQuestions: boolean;
  title?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getAnswer, setAnswer } = useChecklistAmbulanceStore();

  const isNotes = !!searchParams.get("notes");

  checklistQuestions.sort(
    (a, b) => (a.order_subcategory || 0) - (b.order_subcategory || 0),
  );

  const subcategoryQuestionsMap = new Map<string, ChecklistQuestionsType[]>();
  checklistQuestions.forEach((question) => {
    const key = question.name_subcategory || "NOT_SUBCATEGORY";
    const arr = subcategoryQuestionsMap.get(key) ?? [];
    arr.push(question);
    subcategoryQuestionsMap.set(key, arr);
  });
  const subcategories = Array.from(subcategoryQuestionsMap.keys());

  useEffect(() => {
    // TODO: Obtener las respuestas guardadas para la página actual y cargarlas en el formulario
    const currentPage = Number(searchParams.get("step")) || 1;
    const stepAnswers = getAnswer(`step-${currentPage}`) || [];
    console.log(stepAnswers);
  }, []);

  function handleNextPage() {
    const currentPage = Number(searchParams.get("step")) || 1;
    const nextPageURL =
      createPageURL(currentPage + 1, searchParams, pathname) +
      `${isLastQuestions && !isNotes ? "&notes=1" : ""}`;
    router.push(nextPageURL);
  }

  function handleAnswers(formData: FormData) {
    const stepAnswers = createStepAnswers(formData, checklistQuestions);
    const currentPage = Number(searchParams.get("step")) || 1;
    setAnswer(`step-${currentPage}`, stepAnswers);
  }

  function handleSubmit(formData: FormData) {
    handleAnswers(formData);
    handleNextPage();
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg overflow-hidden"
    >
      <div className="p-4 md:col-span-1 md:row-span-1">{children}</div>

      <div className="flex flex-col gap-2 p-4 md:col-span-3 md:row-span-1">
        <h2 className="relative left-4 -top-4 w-[90%] text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
          {title}
        </h2>
        {subcategories.map((subcategory, index) => (
          <div key={subcategory + index} className="contents">
            {subcategory !== "NOT_SUBCATEGORY" && (
              <h3 key={subcategory} className="font-semibold mt-2 md:ml-24">
                {subcategory}
              </h3>
            )}

            {subcategoryQuestionsMap
              .get(subcategory)
              ?.map(({ id, question, type_response }) => (
                <div
                  key={`question-${id}`}
                  className="flex flex-col gap-2 md:ml-24 md:flex-row md:justify-between"
                >
                  <FormInputSetter
                    key={`question-setter-${id}`}
                    name={id}
                    type={type_response}
                    title={question}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="md:p-4 md:col-span-4 md:row-span-1">
        <PaginationChecklist isLast={isLastQuestions} />
      </div>
    </form>
  );
}
