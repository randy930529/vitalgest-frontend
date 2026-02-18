"use server";

import { revalidatePath } from "next/cache";
import { CreateAmbulance, UpdateAmbulance } from "@/app/lib/schema";
import { AmbulanceType } from "@/app/lib/definitions";
import { AmbulanceState } from "@/app/lib/config/stateConfigs";
import { ActionsServer } from "@/app/lib/actions/actions";

export async function createAmbulance(
  prevState: AmbulanceState,
  formAmbulanceData: FormData,
): Promise<AmbulanceState> {
  const validatedAmbulanceFields = CreateAmbulance.safeParse({
    number: formAmbulanceData.get("number"),
    brand: formAmbulanceData.get("brand"),
    model: formAmbulanceData.get("model"),
    delegationId: formAmbulanceData.get("delegation"),
  });

  if (!validatedAmbulanceFields.success) {
    return {
      errors: validatedAmbulanceFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = `/api/ambulances/create`;
    const actions = new ActionsServer<AmbulanceType>(endPoint, true);
    await actions.create(validatedAmbulanceFields.data);
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/ambulances");
  return { message: "Ambulancia creada exitosamente." };
}

export async function updateAmbulance(
  id: string,
  prevState: AmbulanceState,
  formAmbulanceData: FormData,
): Promise<AmbulanceState> {
  const validatedAmbulanceFields = UpdateAmbulance.safeParse({
    number: formAmbulanceData.get("number"),
    brand: formAmbulanceData.get("brand"),
    model: formAmbulanceData.get("model"),
    delegationId: formAmbulanceData.get("delegation"),
  });

  if (!validatedAmbulanceFields.success) {
    return {
      errors: validatedAmbulanceFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = `/api/ambulances/edit/${id}`;
    const actions = new ActionsServer<AmbulanceType>(endPoint, true);
    await actions.update(validatedAmbulanceFields.data);
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/ambulances");
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteAmbulance(id: string) {
  try {
    const endPoint = `/api/ambulances/delete/${id}`;
    const actions = new ActionsServer<AmbulanceType>(endPoint, true);
    await actions.delete();
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/ambulances");
  return { message: "Ambulancia eliminada exitosamente." };
}
