"use server";

import {
  CheckListAmbulanceType,
  ResponseAPIType,
  StateType,
} from "@/app/lib/definitions";
import { CreateChecklist } from "@/app/lib/schema";
import { verifySession } from "@/app/lib/dal";

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
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/checklists/ambulance/create`;
    const { ambulanceId, shiftId, km } = validatedChecklistFields.data;

    const bodyContent = new FormData();
    bodyContent.append("ambulanceId", ambulanceId);
    bodyContent.append("shiftId", shiftId);
    bodyContent.append("km", String(km));
    bodyContent.append("notes", "");
    bodyContent.append("gasFile", formDataChecklist.get("gasFile") as File);

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "multipart/form-data",
      },
      body: bodyContent,
    };

    const response = await fetch(endPoint, config);

    if (!response.ok) {
      const resut = await response.json();
      console.log(resut);
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }

    const resut: ResponseAPIType<CheckListAmbulanceType> =
      await response.json();

    return { message: "Checklist creada exitosamente.", checklist: resut.data };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}
