"use server";

import { revalidatePath } from "next/cache";
import { ResponseAPIType, ShiftType, StateType } from "@/app/lib/definitions";
import { CreateShift, UpdateShift } from "@/app/lib/schema";
import { verifySession } from "@/app/lib/dal";

export type ShiftState = StateType<{
  ambulanceId?: string[];
  guardId?: string[];
  paramedicalId?: string[];
  driverId?: string[];
  success?: string[];
}> & {
  shift?: ShiftType;
};

export async function createShift(
  prevState: ShiftState,
  formShiftData: FormData
): Promise<ShiftState> {
  const validatedShiftFields = CreateShift.safeParse({
    ambulanceId: formShiftData.get("ambulance"),
    guardId: formShiftData.get("guard"),
    paramedicalId: formShiftData.get("paramedical"),
    driverId: formShiftData.get("driver"),
  });

  if (!validatedShiftFields.success) {
    return {
      errors: validatedShiftFields.error.flatten().fieldErrors,
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

    const endPoint = `${process.env.API_URL}/api/shifts/create`;
    const bodyContent = validatedShiftFields.data;
    console.log(bodyContent);
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    };

    const response = await fetch(endPoint, config);

    if (!response.ok) {
      const resut = await response.json();
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }

    const resut: ResponseAPIType<ShiftType> = await response.json();

    revalidatePath("/dashboard/guards");
    return { message: "Turno asignado exitosamente.", shift: resut.data };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function updateShift(
  id: string,
  prevState: ShiftState,
  formShiftData: FormData
): Promise<ShiftState> {
  const validatedShiftFields = UpdateShift.safeParse({
    number: formShiftData.get("number"),
    brand: formShiftData.get("brand"),
    model: formShiftData.get("model"),
    delegationId: formShiftData.get("delegation"),
  });

  if (!validatedShiftFields.success) {
    return {
      errors: validatedShiftFields.error.flatten().fieldErrors,
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

    const endPoint = `${process.env.API_URL}/api/shifts/edit/${id}`;
    const bodyContent = validatedShiftFields.data;
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    };

    const response = await fetch(endPoint, config);

    if (!response.ok) {
      const resut = await response.json();
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/shifts");
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteShift(id: string) {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/shifts/delete/${id}`;

    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(endPoint, config);

    if (!response.ok) {
      const resut = await response.json();
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/shifts");
  return { message: "Ambulancia eliminada exitosamente." };
}
