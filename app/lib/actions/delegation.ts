"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StateType } from "@/app/lib/definitions";
import { UpdateDelegation } from "@/app/lib/schema";
import { verifySession } from "@/app/lib/dal";

export type DelegationState = StateType<{
  name?: string[];
  state?: string[];
  municipality?: string[];
  success?: string[];
}>;

export async function createDelegation(
  prevState: DelegationState,
  formDelegationData: FormData
): Promise<DelegationState> {
  const validatedDelegationFields = UpdateDelegation.safeParse({
    name: formDelegationData.get("name"),
    state: Number(formDelegationData.get("state")),
    municipality: Number(formDelegationData.get("municipality")),
  });

  if (!validatedDelegationFields.success) {
    return {
      errors: validatedDelegationFields.error.flatten().fieldErrors,
    };
  }

  const { state, municipality } = validatedDelegationFields.data;
  try {
    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    if (!session?.isAuth) redirect("/login");
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }

    const endPoint = `${process.env.API_URL}/api/delegations/create`;
    const bodyContent = {
      stateName: " ",
      municipalityName: " ",
      stateId: state,
      municipalityId: municipality,
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
  return { errors: {}, message: "Delegación creada exitosamente." };
}

export async function updateDelegation(
  id: string,
  prevState: DelegationState,
  formDelegationData: FormData
): Promise<DelegationState> {
  const validatedDelegationFields = UpdateDelegation.safeParse({
    name: formDelegationData.get("name"),
    state: Number(formDelegationData.get("state")),
    municipality: Number(formDelegationData.get("municipality")),
  });

  if (!validatedDelegationFields.success) {
    console.log("Validation Error:", validatedDelegationFields.error);
    return {
      errors: validatedDelegationFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Delegation.",
    };
  }

  const { state, municipality } = validatedDelegationFields.data;

  try {
    // Obtener el token desde la cache usando cookies
    const session = await verifySession();
    if (!session?.isAuth) redirect("/");
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${process.env.API_URL}/api/delegations/edit/${id}`;
    const bodyContent = {
      name: " ",
      stateId: state,
      municipalityId: municipality,
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
      console.log("Response Error:", await response.json());
      return {
        message: (await response.json())["error"],
      };
    }
  } catch (error) {
    console.log("Try Error:", error);
    return { message: "Database Error: Failed to Update Delegation." };
  }

  revalidatePath("/dashboard/delegations");
  redirect("/dashboard/delegations");
}

export async function deleteDelegation(id: string) {
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
      const resut = await response.json();
      // Revisar "error": "CODE_LIST" para generar mensages persolalizados.
      let errorMessage = resut.error
        ? resut.error
        : "Falló la comunicación con el api, intente más tarde.";
      throw new Error(errorMessage);
    }
  } catch (error) {
    // return {
    //   errors: {
    //     success: [error instanceof Error ? error.message : String(error)],
    //   },
    // };
  }

  revalidatePath("/dashboard/delegations");
  // return { message: "Delegación eliminada exitosamente." };
}
