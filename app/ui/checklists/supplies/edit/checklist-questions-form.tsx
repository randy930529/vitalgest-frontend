"use client";

import { useEffect, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SupplyAmbulanceType } from "@/app/lib/definitions";
import { createPageURL, createStepSupplyAnswers } from "@/app/lib/utils";
import { useChecklistSupplyStore } from "@/app/lib/store/checklist-answers";
import { PaginationChecklist } from "@/app/ui/components/pagination";
import { FormInputSingle } from "@/app/ui/dashboard/form-fields";

export default function ChecklistQuestionsForm({
  children,
  data: suppliesAmbulance,
  isLastQuestions,
  title,
}: {
  children?: React.ReactNode;
  data: SupplyAmbulanceType[];
  isLastQuestions: boolean;
  title?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getAnswer, setAnswer } = useChecklistSupplyStore();
  const [isPending, startTransition] = useTransition();

  const isNotes = !!searchParams.get("notes");

  const categoryQuestionsMap = new Map<string, SupplyAmbulanceType[]>();
  suppliesAmbulance.forEach((supply) => {
    const key = supply.category;
    const arr = categoryQuestionsMap.get(key) ?? [];
    arr.push(supply);
    categoryQuestionsMap.set(key, arr);
  });
  const categories = Array.from(categoryQuestionsMap.keys());

  useEffect(() => {
    // TODO: Obtener las respuestas guardadas en el store para la
    // página actual y cargarlas en el formulario
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
    const stepAnswers = createStepSupplyAnswers(formData);
    const currentPage = Number(searchParams.get("step")) || 1;
    setAnswer(`step-${currentPage}`, stepAnswers);
  }

  function handleSubmit(formData: FormData) {
    startTransition(() => {
      handleAnswers(formData);
      handleNextPage();
    });
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto gap-4 p-4 shadow-md sm:rounded-lg overflow-hidden"
    >
      <div className="p-4 md:col-span-1 md:row-span-1">{children}</div>

      <div className="flex flex-col gap-2 md:p-4 md:col-span-3 md:row-span-1">
        <h2 className="relative left-4 -top-4 w-[90%] text-xl md:text-2xl font-bold dark:text-white text-center md:text-left">
          {title}
        </h2>
        <SuppliesTable>
          {categories.map((category, index) => (
            <div key={category + index} className="contents">
              {categoryQuestionsMap
                .get(category)
                ?.map(
                  (
                    { id, category, avaible_quantity, specification },
                    index,
                  ) => (
                    <SupplyRowTable
                      key={`question-${id}`}
                      id={id}
                      category={index === 0 ? category : ""}
                      avaible_quantity={avaible_quantity}
                      specification={specification}
                    />
                  ),
                )}
            </div>
          ))}
        </SuppliesTable>
        {!categories.length && (
          <span className="text-center text-gray-400">
            No hay insumos asignados a la ambulancia.
          </span>
        )}
      </div>
      <div className="md:p-4 md:col-span-4 md:row-span-1">
        {/* 
        TODO: Corregir ir anterior en la primera pagina //por cambios en la
        ruta de /checklist/ambulances/shiftId a /checklist/ambulances/shiftId/create.
        */}
        <PaginationChecklist
          isLast={isLastQuestions}
          link="supplies"
          submitDisabled={isPending}
        />
      </div>
    </form>
  );
}

function SupplyRowTable({
  id,
  category,
  specification,
  avaible_quantity,
}: {
  id: string;
  category: string;
  specification: string;
  avaible_quantity: number;
}) {
  return (
    <li className="grid grid-cols-4 gap-2 border-b border-gray-200 py-2 text-xs sm:text-sm md:gap-4 md:text-base">
      <div className="min-w-fit">{category}</div>
      <div className="min-w-fit">{specification}</div>
      <div>
        <FormInputSingle
          name={`supply~${id}`}
          type="number"
          placeholder="0"
          initialValue={String(avaible_quantity)}
        />
      </div>
      <div>
        <FormInputSingle
          name={`details~${id}`}
          type="text"
          placeholder="Observación..."
        />
      </div>
    </li>
  );
}

function SuppliesTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-auto md:p-4">
      {/* <!-- Encabezado --> */}
      <div className="grid grid-cols-4 gap-2 font-semibold border-b border-gray-400 pb-2 text-xs text-gray-700 sm:text-sm md:text-base md:gap-4">
        <div className="min-w-0 truncate">Categoría</div>
        <div className="min-w-0 truncate">Especificación</div>
        <div className="min-w-0 truncate">Cantidad</div>
        <div className="min-w-0 truncate">Observaciones</div>
      </div>

      {/* <!-- Filas dinámicas --> */}
      <ul className="space-y-2 mt-2">{children}</ul>
    </div>
  );
}
