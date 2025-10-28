"use server";

import { revalidatePath } from "next/cache";
import { StateType } from "@/app/lib/definitions";
import { CreateUser, UpdateUser } from "@/app/lib/schema";
import { verifySession } from "@/app/lib/dal";

export type UserState = StateType<{
  name?: string[];
  lastname?: string[];
  email?: string[];
  password?: string[];
  role?: string[];
  status?: string[];
  position?: string[];
  delegation?: string[];
  success?: string[];
}>;

export async function createUser(
  prevState: UserState,
  formUserData: FormData
): Promise<UserState> {
  const validatedUserFields = CreateUser.safeParse({
    name: formUserData.get("name"),
    lastname: formUserData.get("lastname"),
    email: formUserData.get("email"),
    password: formUserData.get("password"),
    position: formUserData.get("position"),
    role: formUserData.get("role"),
    delegation: formUserData.get("delegation"),
  });

  if (!validatedUserFields.success) {
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
    };
  }

  const { name, lastname, email, password, position, role, delegation } =
    validatedUserFields.data;

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

    const endPoint = `${process.env.API_URL}/api/adm/create/user`;

    const bodyContent = {
      name,
      lastname,
      email,
      password,
      role,
      position,
      delegationId: delegation,
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

  return { message: "Usuario creado exitosamente." };
}

export async function updateUser(
  id: string,
  prevState: UserState,
  formUserData: FormData
): Promise<UserState> {
  const validatedUserFields = UpdateUser.safeParse({
    name: formUserData.get("name"),
    lastname: formUserData.get("lastname"),
    email: formUserData.get("email"),
    password: formUserData.get("password"),
    role: formUserData.get("role"),
    position: formUserData.get("position"),
    status: formUserData.get("status") === "on",
    delegation: formUserData.get("delegation"),
  });

  if (!validatedUserFields.success) {
    return {
      errors: validatedUserFields.error.flatten().fieldErrors,
    };
  }

  const { name, lastname, email, role, position, status, delegation } =
    validatedUserFields.data;

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

    const endPoint = `${process.env.API_URL}/api/adm/edit/user/${id}`;

    const bodyContent = {
      name,
      lastname,
      email,
      role,
      status,
      position,
      delegationId: delegation,
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

  revalidatePath("/dashboard/users");
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteUser(id: string): Promise<UserState> {
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

    const endPoint = `${process.env.API_URL}/api/adm/delete/user/${id}`;

    const response = await fetch(endPoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });

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
  return { message: "Usuario eliminado exitosamente." };
}
