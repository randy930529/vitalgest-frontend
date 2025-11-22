"use server";

import { revalidatePath } from "next/cache";
import { StateType } from "@/app/lib/definitions";
import { CreateDelegation, UpdateDelegation } from "@/app/lib/schema";
import { verifySession } from "@/app/lib/dal";

export type DelegationState = StateType<{
  state?: string[];
  municipality?: string[];
  success?: string[];
}>;

export async function createDelegation(
  prevState: DelegationState,
  formDelegationData: FormData
): Promise<DelegationState> {
  const validatedDelegationFields = CreateDelegation.safeParse({
    state: formDelegationData.get("state"),
    municipality: formDelegationData.get("municipality"),
  });

  if (!validatedDelegationFields.success) {
    return {
      errors: validatedDelegationFields.error.flatten().fieldErrors,
    };
  }

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

    const endPoint = `${process.env.API_URL}/api/delegations/create`;
    const { state, municipality } = validatedDelegationFields.data;
    const bodyContent = {
      stateName: state.split("-")[1],
      municipalityName: municipality.split("-")[1],
      municipalityId: municipality.split("-")[0],
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
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/users");
  return { message: "Delegación creada exitosamente." };
}

export async function updateDelegation(
  id: string,
  prevState: DelegationState,
  formDelegationData: FormData
): Promise<DelegationState> {
  const validatedDelegationFields = UpdateDelegation.safeParse({
    name: formDelegationData.get("name"),
    state: formDelegationData.get("state"),
    municipality: formDelegationData.get("municipality"),
  });

  if (!validatedDelegationFields.success) {
    return {
      errors: validatedDelegationFields.error.flatten().fieldErrors,
    };
  }

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

    const endPoint = `${process.env.API_URL}/api/delegations/edit/${id}`;
    const { name, state, municipality } = validatedDelegationFields.data;
    console.log(validatedDelegationFields.data);

    const bodyContent = {
      name,
      municipalityName: municipality.split("-")[1],
      municipalityId: municipality.split("-")[0],
    };

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

  revalidatePath("/dashboard/delegations");
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteDelegation(id: string) {
  try {
    if (!process.env.API_URL) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    const apiToken = session?.accessToken;

    const endPoint = `${process.env.API_URL}/api/delegations/delete/${id}`;

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
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
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

  revalidatePath("/dashboard/delegations");
  return { message: "Delegación eliminada exitosamente." };
}
