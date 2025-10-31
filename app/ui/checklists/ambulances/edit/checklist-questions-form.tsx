"use client";

import { ChecklistQuestionsType } from "@/app/lib/definitions";
import { FormCheckbox, FormSelect } from "@/app/ui/dashboard/form-fields";
import { PaginationChecklist } from "@/app/ui/dashboard/pagination";

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
  checklistQuestions.sort(
    (a, b) => (a.order_subcategory || 0) - (b.order_subcategory || 0)
  );

  const subcategoryQuestionsMap = new Map<string, ChecklistQuestionsType[]>();
  checklistQuestions.forEach((question) => {
    const key = question.name_subcategory || "NOT_SUBCATEGORY";
    const arr = subcategoryQuestionsMap.get(key) ?? [];
    arr.push(question);
    subcategoryQuestionsMap.set(key, arr);
  });
  const subcategories = Array.from(subcategoryQuestionsMap.keys());

  return (
    <form className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4">
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
              ?.map(({ id, question, boolean_response, enum_response }) => (
                <div
                  key={`question-${id}`}
                  className="flex flex-col gap-2 md:ml-24 md:flex-row md:justify-between"
                >
                  <FormCheckbox
                    key={`question-checkbox-${id}`}
                    name={id}
                    title={question}
                    isChecked={boolean_response}
                  />
                  {enum_response && (
                    <FormSelect
                      key={`question-select-${id}`}
                      name={id}
                      options={[
                        {
                          id: 1,
                          value: "bueno",
                          label: `Bueno\u00A0\u00A0\u00A0`,
                        },
                        {
                          id: 2,
                          value: "regular",
                          label: "Regular\u00A0\u00A0\u00A0",
                        },
                        {
                          id: 3,
                          value: "malo",
                          label: "Malo\u00A0\u00A0\u00A0",
                        },
                      ]}
                    />
                  )}
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
