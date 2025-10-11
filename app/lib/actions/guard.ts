"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateGuard } from "@/app/lib/schema";
import { StateType } from "@/app/lib/definitions";
import { verifySession } from "@/app/lib/dal";

export type GuardState = StateType<{
  guardChief?: string[];
  date?: string[];
  ambulance?: string[];
  success?: string[];
}>;

export async function createGuard(
  prevState: GuardState,
  formGuarData: FormData
): Promise<GuardState> {
  const date = formGuarData.get("date") as string;

  const validatedGuardFields = CreateGuard.safeParse({
    guardChief: formGuarData.get("guardChief"),
    date: new Date(date),
  });

  if (!validatedGuardFields.success) {
    return {
      errors: validatedGuardFields.error.flatten().fieldErrors,
    };
  }

  const { guardChief } = validatedGuardFields.data;
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
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/guards");
  console.log("Guard created successfully.");

  return { message: "Guardia creada exitosamente." };
}

export async function deleteGuard(id: string) {
  try {
    // Obtener el token desde la cache usando cookies (Next.js recomienda cookies para datos persistentes)
    // const apiToken = (await cookies()).get("apiToken")?.value;
    const session = await verifySession();
    if (!session?.isAuth) redirect("/");
    const apiToken = session?.accessToken;

    if (!process.env.API_URL || !apiToken) {
      throw new Error(
        "Las variables de conexión a la API no están configuradas."
      );
    }
    const endPoint = `${process.env.API_URL}/api/adm/delete/guard/${id}`;

    const response = await fetch(endPoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

    // if (!response.ok) {
    //   return {
    //     errors: {},
    //     message: (await response.json())["error"],
    //   };
    // }
    console.log(id, await response.json());
  } catch (error) {
    // return { errors: {}, message: "Database Error: Failed to Delete User." };
  }

  revalidatePath("/dashboard/guards");
  // return { errors: {}, message: "User deleted successfully." };
}
