"use server";

import { revalidatePath } from "next/cache";
import { StateType, SupplyType } from "@/app/lib/definitions";
import { CreateSupply, UpdateSupply } from "@/app/lib/schema";
import { ActionsServer } from "@/app/lib/actions/actions";

export type SupplyState = StateType<{
  pharmacy?: string[];
  category?: string[];
  specification?: string[];
  avilableQuantity?: string[];
  expirationDate?: string[];
  measurementUnit?: string[];
  notes?: string[];
  success?: string[];
}>;

export async function createSupply(
  prevState: SupplyState,
  formDataSupply: FormData
): Promise<SupplyState> {
  const date = formDataSupply.get("date") as string;

  const validatedSupplyFields = CreateSupply.safeParse({
    pharmacyId: formDataSupply.get("pharmacy"),
    category: formDataSupply.get("category"),
    specification: formDataSupply.get("specification"),
    avilableQuantity: Number(formDataSupply.get("avilableQuantity")),
    expirationDate: new Date(date),
    measurementUnit: formDataSupply.get("measurementUnit"),
  });

  if (!validatedSupplyFields.success) {
    return {
      errors: validatedSupplyFields.error.flatten().fieldErrors,
    };
  }

  const {
    pharmacyId,
    category,
    specification,
    avilableQuantity,
    measurementUnit,
  } = validatedSupplyFields.data;
  try {
    const endPoint = `/api/supplies/create/pharmacy/${pharmacyId}`;
    const actions = new ActionsServer<SupplyType>(endPoint, true);
    await actions.create({
      category,
      specification,
      avilableQuantity,
      expirationDate: date,
      measurementUnit,
    });
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
  return { message: "Insumo agregado exitosamente." };
}

export async function updateSupply(
  id: string,
  prevState: SupplyState,
  formSupplyData: FormData
): Promise<SupplyState> {
  const validatedSupplyFields = UpdateSupply.safeParse({
    pharmacyId: formSupplyData.get("pharmacy"),
    category: formSupplyData.get("category"),
    specification: formSupplyData.get("specification"),
    avilableQuantity: Number(formSupplyData.get("avilableQuantity")),
    expirationDate: Number(formSupplyData.get("expirationDate")),
    measurementUnit: Number(formSupplyData.get("measurementUnit")),
  });

  if (!validatedSupplyFields.success) {
    return {
      errors: validatedSupplyFields.error.flatten().fieldErrors,
    };
  }

  const { pharmacyId } = validatedSupplyFields.data;
  try {
    const endPoint = `/api/supplies/edit/${id}`;
    const actions = new ActionsServer<SupplyType>(endPoint, true);
    await actions.update(validatedSupplyFields.data);
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
  return { message: "Cambios guardados exitosamente." };
}

export async function deleteSupply(id: string, pharmacyId: string) {
  try {
    const endPoint = `/api/supplies/delete/${id}`;
    const actions = new ActionsServer<SupplyType>(endPoint, true);
    await actions.delete();
  } catch (error) {
    return {
      errors: {
        success: [error instanceof Error ? error.message : String(error)],
      },
    };
  }

  revalidatePath(`/dashboard/supplies/pharmacies/${pharmacyId}`);
  return { message: "Ambulancia eliminada exitosamente." };
}
