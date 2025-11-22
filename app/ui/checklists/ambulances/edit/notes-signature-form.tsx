"use client";

import { useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  ChecklistAnswersType,
  ChecklistQuestionsType,
} from "@/app/lib/definitions";
import { createStepAnswers } from "@/app/lib/utils";
import { useChecklistAmbulanceStore } from "@/app/lib/store/checklist-answers";
import {
  ChecklistAnswersState,
  updateCheckListAmbulanceAnswers,
} from "@/app/lib/actions/checklist";
import { FormSignature, FormTextarea } from "@/app/ui/dashboard/form-fields";
import { PaginationChecklist } from "@/app/ui/dashboard/pagination";

export default function NotesSignatureForm({
  children,
  title,
  data: checklistQuestions,
}: {
  children?: React.ReactNode;
  title?: string;
  data: ChecklistQuestionsType[];
}) {
  const router = useRouter();
  const { guardId, id } = useParams<{ guardId: string; id: string }>();
  const { answers, setAnswer, reset } = useChecklistAmbulanceStore();

  const initialState: ChecklistAnswersState = { errors: {}, message: null };
  const updateCheckListAmbulanceAnswersWithId =
    updateCheckListAmbulanceAnswers.bind(null, id || "");
  const [state, formAction] = useActionState(
    updateCheckListAmbulanceAnswersWithId,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      reset();
      state.message = null;
      router.push(`/checklists/${guardId}`);
    }
  }, [state.message]);

  useEffect(() => {
    if (state.errors?.success) {
      state.errors?.success.map((error: string) => toast.error(error));
    }
    if (state.errors?.answers) {
      state.errors?.answers.map((error: string) => toast.error(error));
    }
  }, [state.errors?.success, state.errors?.answers]);

  function handleAnswers(formData: FormData) {
    const stepAnswers = createStepAnswers(formData, checklistQuestions);
    // TODO: Revisar si es correcto guardar las notas en el store de respuestas
    // o quizás manejarlo por separado y enviarlo directamente en el submit.
    setAnswer("notes", stepAnswers);
  }

  function handleSubmit(formData: FormData) {
    handleAnswers(formData);
    const allAnswers: ChecklistAnswersType[] = [];
    Object.values(answers).forEach((stepAnswers) => {
      allAnswers.push(...stepAnswers);
    });
    formAction(allAnswers);
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
          <span className="inline-block align-middle ms-2">
            <InformationCircleIcon className="w-5 h-5 bg-sky-950 text-white font-extrabold rounded-full" />
          </span>
        </h2>

        <FormTextarea key="write-notes" name="notes" rows={10} />

        <div className="flex gap-4 md:gap-20">
          <div className="w-1/2 md:p-4">
            <FormSignature
              key="write-out-signature"
              name="write-out-signature"
              title="Entrega:"
              usersOptions={[
                // TOTEST: Data Test
                {
                  id: "uuid-1",
                  value: "uuid-1",
                  label: "User1",
                  position: "Dev",
                },
                {
                  id: "uuid-2",
                  value: "uuid-2",
                  label: "User2",
                  position: "Test",
                },
              ]}
            />
          </div>

          <div className="w-1/2 md:p-4">
            <FormSignature
              key="write-in-signature"
              name="write-in-signature"
              title="Recibe:"
              usersOptions={[]}
            />
          </div>
        </div>
      </div>

      <div className="md:p-4 md:col-span-4 md:row-span-1">
        <PaginationChecklist isLast />
      </div>
    </form>
  );
}
