"use server";

import { revalidatePath } from "next/cache";
import { CreateGuard } from "@/app/lib/schema";
import { GuardType, ResponseAPIType, StateType } from "@/app/lib/definitions";
import { verifySession } from "@/app/lib/dal";

export type GuardState = StateType<{
  guardChief?: string[];
  date?: string[];
  ambulance?: string[];
  delegationId?: string[];
  success?: string[];
}> & {
  guard?: GuardType;
};

export async function createGuard(
  prevState: GuardState,
  formGuarData: FormData
): Promise<GuardState> {
  const date = formGuarData.get("date") as string;

  const validatedGuardFields = CreateGuard.safeParse({
    delegationId: formGuarData.get("delegation"),
    guardChief: formGuarData.get("guardChief"),
    date: new Date(date),
  });

  if (!validatedGuardFields.success) {
    return {
      errors: validatedGuardFields.error.flatten().fieldErrors,
    };
  }

  const { guardChief, delegationId } = validatedGuardFields.data;
  try {
    // Obtener el token desde la cache usando cookies
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/guards/create`;

    const bodyContent = {
      delegationId,
      guardChief,
      date,
    };

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

    const resut: ResponseAPIType<GuardType> = await response.json();

    revalidatePath("/dashboard/guards");
    console.log("Guard created successfully.");

    return { message: "Guardia creada exitosamente.", guard: resut.data };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function deleteGuard(id: string) {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/guards/delete/${id}`;

    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(endPoint, config);

    if (!response.ok) {
      const result = await response.json();
      // TODO: Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = result.error
        ? result.error
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

  revalidatePath("/dashboard/guards");
  return { message: "Guardia eliminada exitosamente." };
}
