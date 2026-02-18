"use server";

import {
  CheckListAmbulanceType,
  ChecklistAnswersType,
  ChecklistSuppliesType,
  ChecklistSupplyType,
} from "@/app/lib/definitions";
import { ActionsServer } from "@/app/lib/actions/actions";
import {
  CreateChecklist,
  CreateChecklistSupplies,
  SignChecklist,
} from "@/app/lib/schema";
import {
  ChecklistState,
  ChecklistAnswersState,
  ChecklistSuppliesState,
} from "@/app/lib/config/stateConfigs";

export async function createChecklistAmbulance(
  prevState: ChecklistState,
  formDataChecklist: FormData,
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

    const actions = new ActionsServer<CheckListAmbulanceType>(endPoint);
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
  answers: ChecklistAnswersType[],
): Promise<ChecklistAnswersState> {
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
    await actions.update({ answers });

    return { message: "Checklist guardado exitosamente." };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function signCheckListAmbulance(
  id: string,
  prevState: ChecklistState,
  formDataChecklist: FormData,
): Promise<ChecklistState> {
  const validatedChecklistFields = SignChecklist.safeParse({
    recipientId: formDataChecklist.get("write-in-signature"),
    notes: formDataChecklist.get("notes"),
    signOperatorFile: formDataChecklist.get("sign-write-out-signature"),
    signRecipientFile: formDataChecklist.get("sign-write-in-signature"),
  });

  if (!validatedChecklistFields.success) {
    return {
      errors: validatedChecklistFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = `/api/checklists/ambulance/${id}/sign`;

    const bodyContent = new FormData();
    bodyContent.append(
      "recipientId",
      formDataChecklist.get("write-in-signature") as string,
    );
    bodyContent.append("notes", formDataChecklist.get("notes") as string);
    // bodyContent.append(
    //   "signOperatorFile",
    //   formDataChecklist.get("sign-write-out-signature") as File
    // );
    // bodyContent.append(
    //   "signRecipientFile",
    //   formDataChecklist.get("sign-write-in-signature") as File
    // );

    const actions = new ActionsServer<ChecklistAnswersType[]>(endPoint);
    await actions.updateWithFormData(bodyContent);

    return { message: "Checklist aprobado exitosamente." };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function createChecklistSupplies(
  prevState: ChecklistSuppliesState,
  formDataChecklist: FormData,
): Promise<ChecklistSuppliesState> {
  const validatedChecklistFields = CreateChecklistSupplies.safeParse({
    shiftId: formDataChecklist.get("shift"),
  });

  if (!validatedChecklistFields.success) {
    return {
      errors: validatedChecklistFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = "/api/checklists/supply/create";

    const actions = new ActionsServer<ChecklistSuppliesType>(endPoint);
    const checklist = await actions.create(validatedChecklistFields.data);

    return { message: "Checklist creado exitosamente.", checklist: checklist };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function updateCheckListSupplyAnswers(
  id: string,
  prevState: ChecklistAnswersState,
  answers: ChecklistSupplyType[],
): Promise<ChecklistAnswersState> {
  if (!answers.length) {
    return {
      errors: {
        answers: ["No hay respuestas para enviar."],
      },
    };
  }
  try {
    const endPoint = `/api/checklists/supply/answers/${id}`;

    const actions = new ActionsServer<ChecklistSupplyType[]>(endPoint);
    await actions.update({ answers });

    return { message: "Checklist guardado exitosamente." };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function signCheckListSupply(
  id: string,
  prevState: ChecklistState,
  formDataChecklist: FormData,
): Promise<ChecklistState> {
  const validatedChecklistFields = SignChecklist.safeParse({
    recipientId: formDataChecklist.get("write-in-signature"),
    notes: formDataChecklist.get("notes"),
    signOperatorFile: formDataChecklist.get("sign-write-out-signature"),
    signRecipientFile: formDataChecklist.get("sign-write-in-signature"),
  });

  if (!validatedChecklistFields.success) {
    return {
      errors: validatedChecklistFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = `/api/checklists/supply/${id}/sign`;

    const bodyContent = new FormData();
    bodyContent.append(
      "recipientId",
      formDataChecklist.get("write-in-signature") as string,
    );
    bodyContent.append("notes", formDataChecklist.get("notes") as string);
    // bodyContent.append(
    //   "signOperatorFile",
    //   formDataChecklist.get("sign-write-out-signature") as File
    // );
    // bodyContent.append(
    //   "signRecipientFile",
    //   formDataChecklist.get("sign-write-in-signature") as File
    // );

    const actions = new ActionsServer<ChecklistSupplyType[]>(endPoint);
    await actions.updateWithFormData(bodyContent);

    return { message: "Checklist aprobado exitosamente." };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}
