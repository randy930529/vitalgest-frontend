"use server";

import {
  CheckListAmbulanceType,
  ChecklistAnswersType,
  StateType,
} from "@/app/lib/definitions";
import { ActionsServer } from "@/app/lib/actions/actions";
import { CreateChecklist } from "@/app/lib/schema";

export type ChecklistState = StateType<{
  ambulance?: string[];
  shift?: string[];
  km?: string[];
  notes?: string[];
  gasFile?: string[];
  signOperatorFile?: string[];
  signRecipientFile?: string[];
  success?: string[];
}> & {
  checklist?: CheckListAmbulanceType;
};

export type ChecklistAnswersState = StateType<{
  answers?: string[];
  success?: string[];
}>;

export async function createChecklist(
  prevState: ChecklistState,
  formDataChecklist: FormData
): Promise<ChecklistState> {
  const validatedChecklistFields = CreateChecklist.safeParse({
    ambulanceId: formDataChecklist.get("ambulance"),
    shiftId: formDataChecklist.get("shift"),
    km: Number(formDataChecklist.get("km")),
    notes: formDataChecklist.get("notes"),
    gasFile: formDataChecklist.get("gasFile"),
  });

  if (!validatedChecklistFields.success) {
    return {
      errors: validatedChecklistFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = "/api/checklists/ambulance/create";

    const { ambulanceId, shiftId, km } = validatedChecklistFields.data;
    const bodyContent = new FormData();
    bodyContent.append("ambulanceId", ambulanceId);
    bodyContent.append("shiftId", shiftId);
    bodyContent.append("km", String(km));
    bodyContent.append("notes", "");
    bodyContent.append("gasFile", formDataChecklist.get("gasFile") as File);

    const actions = new ActionsServer<CheckListAmbulanceType>(endPoint, true);
    const checklist = await actions.createWithFormData(bodyContent);

    return { message: "Checklist creado exitosamente.", checklist: checklist };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function updateCheckListAmbulanceAnswers(
  id: string,
  prevState: ChecklistAnswersState,
  answers: ChecklistAnswersType[]
): Promise<ChecklistAnswersState> {
  console.log(id, { answers });
  if (!answers.length) {
    return {
      errors: {
        answers: ["No hay respuestas para enviar."],
      },
    };
  }
  try {
    const endPoint = `/api/checklists/ambulance/answers/${id}`;
    const actions = new ActionsServer<ChecklistAnswersType[]>(endPoint);
    await actions.create({ answers });

    return { message: "Checklist guardado exitosamente." };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}
