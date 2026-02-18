"use server";

import { revalidatePath } from "next/cache";
import { UserType } from "@/app/lib/definitions";
import { CreateUser, UpdateUser } from "@/app/lib/schema";
import { UserState } from "@/app/lib/config/stateConfigs";
import { ActionsServer } from "@/app/lib/actions/actions";

export async function createUser(
  prevState: UserState,
  formUserData: FormData,
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

  try {
    const { delegation } = validatedUserFields.data;
    const endPoint = `/api/adm/create/user`;
    const actions = new ActionsServer<UserType>(endPoint, true);
    await actions.create({
      ...validatedUserFields.data,
      delegationId: delegation,
    });
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
  formUserData: FormData,
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

  try {
    const { delegation } = validatedUserFields.data;
    const endPoint = `/api/adm/edit/user/${id}`;
    const actions = new ActionsServer<UserType>(endPoint, true);
    await actions.update({
      ...validatedUserFields.data,
      delegationId: delegation,
    });
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
    const endPoint = `/api/adm/delete/user/${id}`;
    const actions = new ActionsServer<UserType>(endPoint, true);
    await actions.delete();
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
