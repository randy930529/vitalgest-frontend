"use server";

import { revalidatePath } from "next/cache";
import { DelegationType } from "@/app/lib/definitions";
import { CreateDelegation, UpdateDelegation } from "@/app/lib/schema";
import { DelegationState } from "@/app/lib/config/stateConfigs";
import { ActionsServer } from "@/app/lib/actions/actions";

export async function createDelegation(
  prevState: DelegationState,
  formDelegationData: FormData,
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
    const endPoint = `/api/delegations/create`;
    const { state, municipality } = validatedDelegationFields.data;

    const bodyContent = {
      stateName: state.split("-")[1],
      municipalityName: municipality.split("-")[1],
      municipalityId: municipality.split("-")[0],
    };

    const actions = new ActionsServer<DelegationType>(endPoint, true);
    await actions.create(bodyContent);
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
  formDelegationData: FormData,
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
    const endPoint = `/api/delegations/edit/${id}`;
    const { name, municipality } = validatedDelegationFields.data;

    const bodyContent = {
      name,
      municipalityName: municipality.split("-")[1],
      municipalityId: municipality.split("-")[0],
    };

    const actions = new ActionsServer<DelegationType>(endPoint, true);
    await actions.update(bodyContent);
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
    const endPoint = `/api/delegations/delete/${id}`;
    const actions = new ActionsServer<DelegationType>(endPoint, true);
    await actions.delete();
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
