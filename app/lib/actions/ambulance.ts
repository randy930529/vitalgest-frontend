"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StateType } from "@/app/lib/definitions";
import { CreateAmbulance, UpdateAmbulance } from "@/app/lib/schema";
import { verifySession } from "@/app/lib/dal";

export type AmbulanceState = StateType<{
  numero?: string[];
  marca?: string[];
  modelo?: string[];
  success?: string[];
}>;

export async function createAmbulance(
  prevState: AmbulanceState,
  formAmbulanceData: FormData
): Promise<AmbulanceState> {
  const validatedAmbulanceFields = CreateAmbulance.safeParse({
    numero: formAmbulanceData.get("numero"),
    marca: formAmbulanceData.get("marca"),
    modelo: formAmbulanceData.get("modelo"),
  });

  if (!validatedAmbulanceFields.success) {
    return {
      errors: validatedAmbulanceFields.error.flatten().fieldErrors,
    };
  }

  const { numero, marca, modelo } = validatedAmbulanceFields.data;

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

    const endPoint = `${process.env.API_URL}/api/ambulances/create`;
    const bodyContent = {
      numero,
      marca,
      modelo,
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

  revalidatePath("/dashboard/ambulances");
  return { errors: {}, message: "Ambulancia creada exitosamente." };
}

export async function updateAmbulance(
  id: string,
  prevState: AmbulanceState,
  formAmbulanceData: FormData
): Promise<AmbulanceState> {
  const validatedAmbulanceFields = UpdateAmbulance.safeParse({
    numero: formAmbulanceData.get("numero"),
    marca: formAmbulanceData.get("marca"),
    modelo: formAmbulanceData.get("modelo"),
  });

  if (!validatedAmbulanceFields.success) {
    return {
      errors: validatedAmbulanceFields.error.flatten().fieldErrors,
    };
  }

  const { numero, marca, modelo } = validatedAmbulanceFields.data;

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

    const bodyContent = {
      numero,
      marca,
      modelo,
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

  revalidatePath("/dashboard/ambulances");
  redirect("/dashboard/ambulances");
  // return { errors: {}, message: "Cambios guardados exitosamente." };
}

export async function deleteAmbulance(id: string) {
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

    const endPoint = `${process.env.API_URL}/api/ambulances/delete/${id}`;

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

  revalidatePath("/dashboard/ambulances");
  // return { message: "Ambulancia eliminada exitosamente." };
}
