"use server";

import { revalidatePath } from "next/cache";
import { CreateGuard, UpdateGuard } from "@/app/lib/schema";
import { GuardType } from "@/app/lib/definitions";
import { ActionsServer } from "@/app/lib/actions/actions";
import { GuardState } from "@/app/lib/config/stateConfigs";

export async function createGuard(
  prevState: GuardState,
  formGuardData: FormData,
): Promise<GuardState> {
  const date = formGuardData.get("date") as string;

  const validatedGuardFields = CreateGuard.safeParse({
    delegationId: formGuardData.get("delegation"),
    guardChief: formGuardData.get("guardChief"),
    date: new Date(date),
  });

  if (!validatedGuardFields.success) {
    return {
      errors: validatedGuardFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = `/api/guards/create`;
    const actions = new ActionsServer<GuardType>(endPoint);
    const response = await actions.create({
      ...validatedGuardFields.data,
      date,
    });

    revalidatePath("/dashboard/guards");
    console.log("Guard created successfully.");

    return { message: "Guardia creada exitosamente.", guard: response };
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }
}

export async function updateGuard(
  id: string,
  prevState: GuardState,
  formGuardData: FormData,
): Promise<GuardState> {
  const date = formGuardData.get("date") as string;

  const validatedGuardFields = UpdateGuard.safeParse({
    delegationId: formGuardData.get("delegation"),
    guardChief: formGuardData.get("guardChief"),
    date: new Date(date),
    state: formGuardData.get("state"),
  });

  if (!validatedGuardFields.success) {
    return {
      errors: validatedGuardFields.error.flatten().fieldErrors,
    };
  }

  try {
    const endPoint = `/api/guards/edit/${id}`;
    const actions = new ActionsServer<GuardType>(endPoint);
    await actions.update({
      ...validatedGuardFields.data,
      date,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath("/dashboard/guards");
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteGuard(id: string) {
  try {
    const endPoint = `/api/guards/delete/${id}`;
    const actions = new ActionsServer<GuardType>(endPoint);
    await actions.delete();
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

export async function closeGuard(
  id: string,
  guard: GuardType,
): Promise<GuardState> {
  const { guardChief, delegation, state } = guard;
  const date = new Date(guard.date).toISOString().split("T")[0];

  try {
    const endPoint = `/api/guards/edit/${id}`;
    const actions = new ActionsServer<GuardType>(endPoint);
    await actions.update({
      delegationId: delegation.id,
      guardChief: guardChief.id,
      date,
      state,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  return { message: "Cambios guardados exitosamente." };
}
